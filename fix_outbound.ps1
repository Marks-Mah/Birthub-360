
$content = Get-Content -Path src/features/prospecting/outbound/App.tsx -Raw
$import = "import { useAuth } from '../../../contexts/AuthContext.js';"
if ($content -notmatch "useAuth") {
    $content = $content -replace "import \{ useState, useEffect \} from 'react';", "import { useState, useEffect } from 'react';`n$import"
}

$oldCode = @"
  // Auth state
  const \[user, setUser\] = useState<User \| null>\(\(\) => \{
    const saved = localStorage.getItem\('atlas_user'\);
    return saved \? JSON.parse\(saved\) : null;
  \}\);

  const handleLogin = \(loggedUser: User\) => \{
    setUser\(loggedUser\);
    localStorage.setItem\('atlas_user', JSON.stringify\(loggedUser\)\);
  \};

  // Auth & RBAC \(CPI follow-up\): o cookie de sess.o \(httpOnly, o front nunca o l.
  // diretamente\) . quem de fato autoriza cada chamada . API a partir de agora - o
  // objeto em localStorage . s. para a UI lembrar "quem estava logado" ao recarregar
  // a p.gina, sem precisar pedir email/senha de novo. Por isso o logout precisa
  // avisar o servidor para invalidar o cookie, n.o s. limpar o estado local; nunca
  // deve travar o bot.o de sair, mesmo se a chamada falhar \(ex: j. sem sess.o\).
  const handleLogout = \(\) => \{
    setUser\(null\);
    localStorage.removeItem\('atlas_user'\);
    fetch\('/api/auth/logout', \{ method: 'POST', credentials: 'include' \}\).catch\(\(\) => \{\}\);
  \};
"@

$newCode = @"
  const { currentUser } = useAuth();
  
  const user: User | null = currentUser ? {
    id: currentUser.id,
    email: currentUser.email,
    name: currentUser.name,
    role: currentUser.role === "ADMIN" ? "admin" : currentUser.role === "GESTOR" ? "gestor" : "user"
  } : null;

  const handleLogin = (u: User) => {};
  const handleLogout = () => {};
"@

$content = $content -replace $oldCode, $newCode
Set-Content -Path src/features/prospecting/outbound/App.tsx -Value $content

