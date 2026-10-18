
import Dental3D from "../components/Dental3D";

export default function Test3D() {
  return (
    <section className="bg-brand-light/20 py-16">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-center text-4xl font-bold text-brand-dark">
          3D Test
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-center text-gray-600">
          A temporary page for trying out Three.js. Drag the object
          to rotate it, and hover over it to see it react.
        </p>

        <div className="mt-8 rounded-xl bg-white p-4 shadow-md">
          <Dental3D />
        </div>
      </div>
    </section>
  );
}
