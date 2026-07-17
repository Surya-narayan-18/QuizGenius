export default function ErrorState({ message, onRetry }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '20px',
        padding: '40px',
        textAlign: 'center',
      }}
    >
      {/* Sad owl / emoji */}
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: '#FFD2D2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          border: '3px solid #FF4B4B',
        }}
      >
        😕
      </div>

      <div>
        <h2
          style={{
            fontWeight: 800,
            fontSize: '1.6rem',
            color: '#3C3C3C',
            marginBottom: '10px',
          }}
        >
          Oops! Something went wrong
        </h2>
        <p
          style={{
            color: '#777',
            fontSize: '1rem',
            maxWidth: '400px',
            lineHeight: 1.6,
          }}
        >
          {message || "We couldn't generate your quiz. Please try again!"}
        </p>
      </div>

      {onRetry && (
        <button onClick={onRetry} className="btn-duo btn-duo-blue" type="button">
          🔄 Try Again
        </button>
      )}
    </div>
  );
}
