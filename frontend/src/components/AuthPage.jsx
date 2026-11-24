import {useState} from "react";
import {useAuth} from "../auth/AuthContext.jsx";
import {sectionLabel} from "../utils/menuStyles.js";

const inputClass =
  "w-full rounded-ui border border-line bg-white px-3 py-2.5 text-base text-ink outline-none md:py-2 md:text-sm placeholder:text-ink-faint focus:border-ink/40";

export default function AuthPage() {
  const {login, register} = useAuth();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(isLogin ? "register" : "login");
    setError("");
  };

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-6">
      <section className="w-full max-w-sm">
        <p className={`${sectionLabel} mb-3.5`}>my-editor</p>
        <h1 className="mb-8 font-serif text-4xl font-medium leading-tight tracking-tight text-ink">
          {isLogin ? "Iniciar sesión" : "Crear cuenta"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className={sectionLabel}>Nombre</label>
              <input id="name" type="text" required value={name}
                     onChange={(e) => setName(e.target.value)} className={inputClass}/>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className={sectionLabel}>Email</label>
            <input id="email" type="email" required value={email}
                   onChange={(e) => setEmail(e.target.value)} className={inputClass}/>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className={sectionLabel}>Contraseña</label>
            <input id="password" type="password" required minLength={8} value={password}
                   onChange={(e) => setPassword(e.target.value)} className={inputClass}/>
          </div>

          {error && <p role="alert" className="text-sm text-ink">{error}</p>}

          <button type="submit" disabled={submitting}
                  className="cursor-pointer rounded-ui bg-ink px-3 py-3 text-sm font-medium text-white md:py-2 transition-colors hover:bg-ink/85 disabled:cursor-default disabled:opacity-60">
            {submitting ? "Un momento..." : isLogin ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        <button type="button" onClick={switchMode}
                className="mt-4 cursor-pointer py-2 text-sm text-ink-soft hover:text-ink">
          {isLogin ? "¿No tenés cuenta? Registrate" : "¿Ya tenés cuenta? Iniciá sesión"}
        </button>
      </section>
    </main>
  );
}
