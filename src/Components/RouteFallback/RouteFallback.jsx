export default function RouteFallback() {
  return (
    <div className="route-fallback">
      <div className="route-fallback__spinner" aria-hidden="true" />
      <p>Cargando...</p>
    </div>
  );
}
