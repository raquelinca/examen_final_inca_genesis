export default function Button({ children, onClick, variant = 'primary', type = 'button', disabled = false }) {
  const styles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-300'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${styles[variant]} disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
