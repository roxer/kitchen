import sygnet from "@assets/images/Pennylane_logo1.svg";

function WelcomeInfo() {
  return (
    <div className="max-w-2xl p-4 text-center">
      <img src={sygnet} alt="Logo" className="mx-auto mb-6 h-16" />
      <h1 className="mb-4 text-4xl font-bold text-gray-900">
        Welcome to the Demo App
      </h1>
      <p className="mb-6 text-lg text-gray-600">
        This is a project designed to show
        Rails 8.1 and React 19.2 in a full-stack environment.
      </p>
      <div className="mt-8 space-y-4">
        <div className="rounded-lg bg-gray-50 p-6 text-left">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">
            Getting Started
          </h2>
          <p className="mb-4 text-gray-700">
            To learn more about this project and find challenge instructions,
            please refer to:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2 font-semibold text-indigo-600">•</span>
              <span>
                <strong>README.md</strong> - Located in the repository root,
                contains project overview and getting started instructions
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-semibold text-indigo-600">•</span>
              <span>
                <strong>docs/</strong> folder - Contains detailed documentation
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WelcomeInfo;
