import {Router} from "express";
import {randomUUID} from "node:crypto";
import {hashPassword, verifyPassword} from "../utils/password.js";
import {generateRefreshToken, hashToken, refreshCookieOptions, RERESH_TTL_MS, signAccessToken} from "../utils/token.js";
import {createUserWithAccount, findUserByEmail, findUserById} from "../repositories/users.js";
import {createRefreshToken, findRefreshTokenByHash, revokeRefreshToken, revokeFamily} from "../repositories/refreshToken.js";

const router = Router();

router.post("/register", async (req, res) => {
  const {name, email, password} = req.body;

  if (!name || !email || !password || password.length < 8) {
    return res.status(400).json({error: "Datos inválidos. La contraseña tiene que tener al menos 8 caracteres"});
  }

  const passwordHash = await hashPassword(password);

  try {
    const user = await createUserWithAccount({id: randomUUID(), name, email, passwordHash});
    res.status(201).json(user);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({error: "El email ya está registrado"});
    }
    throw err;
  }
});

async function startSession(res,userId, familyId = randomUUID()) {
  const refreshToken = generateRefreshToken();

  await createRefreshToken({
    id: randomUUID(),
    userId,
    familyId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + RERESH_TTL_MS)
  });
  res.cookie("refresh_token", refreshToken, {...refreshCookieOptions, maxAge: RERESH_TTL_MS})
  return signAccessToken(userId)
}

router.post("/login", async (req, res) => {
  const {email, name, password} = req.body;

  if(!email || !password) return res.status(400).json({error: "Faltan llenar los campos"})

  const user = await findUserByEmail(email)
  const valid = user && user.password_hash ? await verifyPassword(password, user.password_hash) : false;

  if(!valid) return res.status(401).json({error: "Email o contraseña incorrecta"})

  const accessToken = await startSession(res, user.id);

  res.json({accessToken, user: {id: user.id, name: user.name, email: user.email}})
})

router.post("/refresh", async (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) return res.status(401).json({error: "No autenticado"});

  const stored = await findRefreshTokenByHash(hashToken(token));
  if (!stored) {
    res.clearCookie("refresh_token", refreshCookieOptions);
    return res.status(401).json({error: "Sesión inválida"});
  }

  if (stored.revoked_at) {
    await revokeFamily(stored.family_id);
    res.clearCookie("refresh_token", refreshCookieOptions);
    return res.status(401).json({error: "Sesión inválida"});
  }

  if (new Date(stored.expires_at) < new Date()) {
    res.clearCookie("refresh_token", refreshCookieOptions);
    return res.status(401).json({error: "Sesión vencida"});
  }

  await revokeRefreshToken(stored.id);
  const accessToken = await startSession(res, stored.user_id, stored.family_id);
  const user = await findUserById(stored.user_id);
  res.json({accessToken, user});
});

router.post("/logout", async (req, res) => {
  const token = req.cookies.refresh_token;
  if (token) {
    const stored = await findRefreshTokenByHash(hashToken(token));
    if (stored) await revokeFamily(stored.family_id);
  }
  res.clearCookie("refresh_token", refreshCookieOptions);
  res.status(204).end();
});


export default router;
