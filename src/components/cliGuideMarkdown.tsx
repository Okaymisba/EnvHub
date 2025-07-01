import {Copy} from "lucide-react";

export const CLIGuide = () => {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="space-y-6 text-gray-300">
            <h2 className="text-xl font-bold text-white">CLI Usage Guide</h2>
            <p>
                EnvHub CLI provides a secure way to manage your environment variables directly from your terminal.
                It supports encryption and seamless integration with your development workflow.
            </p>

            <h3 className="text-lg font-semibold text-white">Installation</h3>
            <pre className="bg-slate-900/60 p-4 rounded-lg text-purple-300 font-mono relative">
        <button
            className="absolute top-2 right-2 bg-purple-900/30 p-1 rounded hover:bg-purple-900/50"
            onClick={() => copyToClipboard('npm install -g envhub-cli')}
        >
          <Copy className="w-4 h-4"/>
        </button>
        <code>npm install -g envhub-cli</code>
      </pre>

            <h3 className="text-lg font-semibold text-white">Basic Commands</h3>

            <div className="space-y-4">
                <div>
                    <p className="font-semibold text-purple-400">1. Login</p>
                    <pre className="bg-slate-900/60 p-4 rounded-lg text-purple-300 font-mono relative">
                                <button
                                    className="absolute top-2 right-2 bg-purple-900/30 p-1 rounded hover:bg-purple-900/50"
                                    onClick={() => copyToClipboard('envhub login')}
                                >
          <Copy className="w-4 h-4"/>
        </button>
            <code>{`envhub login
# You will be prompted for:
# - Email
# - Password (hidden input)`}</code>
          </pre>
                </div>
                <div>
                    <p className="font-semibold text-purple-400">2. Clone a project</p>
                    <pre className="bg-slate-900/60 p-4 rounded-lg text-purple-300 font-mono relative">
                        <button
                            className="absolute top-2 right-2 bg-purple-900/30 p-1 rounded hover:bg-purple-900/50"
                            onClick={() => copyToClipboard('envhub clone your-project-name')}
                        >
          <Copy className="w-4 h-4"/>
        </button>
            <code>envhub clone your-project-name</code>
          </pre>
                </div>
                <div>
                    <p className="font-semibold text-purple-400">3. List environment variables</p>
                    <pre className="bg-slate-900/60 p-4 rounded-lg text-purple-300 font-mono relative">
                        <button
                            className="absolute top-2 right-2 bg-purple-900/30 p-1 rounded hover:bg-purple-900/50"
                            onClick={() => copyToClipboard('envhub list')}
                        >
          <Copy className="w-4 h-4"/>
        </button>
            <code>envhub list</code>
          </pre>
                </div>
                <div>
                    <p className="font-semibold text-purple-400">Add new environment variable</p>
                    <pre className="bg-slate-900/60 p-4 rounded-lg text-purple-300 font-mono relative">
                        <button
                            className="absolute top-2 right-2 bg-purple-900/30 p-1 rounded hover:bg-purple-900/50"
                            onClick={() => copyToClipboard('envhub add')}
                        >
          <Copy className="w-4 h-4"/>
        </button>
            <code>{`envhub add
# You'll be prompted for:
# - Variable name
# - Variable value (hidden input)`}</code>
          </pre>
                </div>
                {/* Add more blocks as needed */}
            </div>

            <h3 className="text-lg font-semibold text-white">Quick Tips</h3>
            <ul className="list-disc list-inside space-y-1">
                <li>🔍 Use <code className="bg-purple-950 px-1 py-0.5 rounded">envhub whoami</code> to check your current
                    login status
                </li>
                <li>🚪 Use <code className="bg-purple-950 px-1 py-0.5 rounded">envhub logout</code> to securely log out
                </li>
            </ul>

            <h3 className="text-lg font-semibold text-white">Best Practices</h3>
            <ul className="list-disc list-inside space-y-1">
                <li>Never commit the decrypted <code className="bg-purple-950 px-1 py-0.5 rounded">.env</code> file to version control</li>
                <li>Regularly update your CLI tool for security features</li>
                <li>Use strong project passwords and rotate them periodically</li>
            </ul>
        </div>
    );
};
