export function authErrorMessage(error) {
  const messages = {
    'auth/invalid-credential': 'El correo o la contraseña no son correctos.',
    'auth/wrong-password': 'El correo o la contraseña no son correctos.',
    'auth/user-not-found': 'El correo o la contraseña no son correctos.',
    'auth/invalid-email': 'Revisá el formato del correo.',
    'auth/email-already-in-use': 'Ese correo ya tiene una cuenta. Iniciá sesión.',
    'auth/weak-password': 'Usá una contraseña de al menos 6 caracteres.',
    'auth/password-does-not-meet-requirements': 'La contraseña no cumple los requisitos del proyecto.',
    'auth/too-many-requests': 'Hubo demasiados intentos. Esperá un momento y volvé a probar.',
    'auth/network-request-failed': 'No se pudo conectar. Revisá tu conexión a internet.',
    'auth/operation-not-allowed': 'El acceso con correo y contraseña todavía no está habilitado en Firebase.',
    'auth/unauthorized-domain': 'Este dominio todavía no está autorizado en Firebase.',
    'auth/user-disabled': 'Esta cuenta está deshabilitada.',
    'auth/configuration-not-found': 'Falta habilitar Authentication en el proyecto Firebase.',
    'auth/requires-recent-login': 'Volvé a iniciar sesión para realizar este cambio.',
  };
  return messages[error?.code] || 'No se pudo completar la operación. Volvé a intentar.';
}
