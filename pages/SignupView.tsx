import AuthGoogleButton from '../components/AuthGoogleButton';
const SignupView = () => {
  return (
    <div className="text-center mt-10">
      <h2 className="text-3xl font-bold mb-4">Registro de usuario</h2>
      <AuthGoogleButton />
      <p className="mt-6">Aquí irá el formulario de registro para distribuidores o compradores.</p>
    </div>
  );
};

export default SignupView;
