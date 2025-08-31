export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    publishedAt: string;
    author: {
        name: string;
        avatar: string;
    };
    coverImage?: string;
    tags?: string[];
}

// Mock data for blog posts
export const blogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'Why I Created Envhub',
        slug: 'why-i-created-envhub',
        excerpt: 'My story as a developer and how I created Envhub.',
        content: '# Why I Created Envhub – My Story as a Developer\n' +
            '\n' +
            'We all face small but frustrating problems as developers. Some of them keep happening again and again, and one day, you just get tired of it and decide to fix it yourself.\n' +
            '\n' +
            'That\'s exactly what happened with me — and that\'s how **Envhub** was born.\n' +
            '\n' +
            '---\n' +
            '\n' +
            '## The Problem: Losing `.env` Files\n' +
            '\n' +
            'I once lost a very important `.env` file for one of my projects.  \n' +
            'If you\'re not familiar with `.env` files, they\'re used to store things like:\n' +
            '\n' +
            '- API keys  \n' +
            '- Database URLs  \n' +
            '- Secret tokens  \n' +
            '- Other environment settings  \n' +
            '\n' +
            'These are needed to run your app, but they\'re also sensitive and should **never be shared publicly**.\n' +
            '\n' +
            'One day, I updated my Linux distribution, and things went south quickly. The system became unstable — freezing, crashing, and eating up RAM like there was no tomorrow. After days of troubleshooting, I had no choice but to reinstall my OS.\n' +
            '\n' +
            'That\'s when disaster struck. At the time, I was working on a major project with dozens of environment variables — API keys, database credentials, third-party service tokens — some of which were one-time credentials that couldn\'t be copied again. Since these files contain sensitive information, they weren\'t in version control (as they shouldn\'t be), and I hadn\'t backed them up separately. When I realized my mistake, I was devastated. I couldn\'t run any of my projects, and I had no idea what half of the values were. I spent days reaching out to services, trying to regenerate API keys, and reconfiguring everything from scratch.\n' +
            '\n' +
            'That moment really frustrated me.\n' +
            '\n' +
            '\n' +
            '---\n' +
            '\n' +
            '## The Idea: A Simple and Secure tool for managing `.env` Files\n' +
            '\n' +
            'As I sat there staring at my terminal, frustrated by the hours I had just lost, a thought struck me. Why isn\'t there a simple, secure way to manage environment variables — something as intuitive as GitHub but specifically designed for `.env` files?\n' +
            '\n' +
            'That\'s when the idea for Envhub was born. I envisioned a tool that would let me:\n' +
            '\n' +
            '> "Securely store my environment variables in the cloud, accessible from anywhere, with the simplicity of Git-like commands from my terminal. No more scattered files, no more forgotten backups — just a single source of truth for all my environment configurations."\n' +
            '\n' +
            'The core principles were clear from the start:\n' +
            '- **Simplicity**: Commands should be intuitive, like `envhub add` and `envhub pull`\n' +
            '- **Security**: End-to-end encryption by default, with zero-knowledge architecture\n' +
            '- **Accessibility**: Available from any machine, anywhere, with just a terminal\n' +
            '- **Reliability**: Built to be rock-solid, because losing environment variables is not an option\n' +
            '\n' +
            'No more messy sharing through insecure channels. No more forgetting to back up important configurations. No more losing track of which environment variables go with which project. Just a fast, simple, and secure way to manage your environment variables, right from your terminal.\n' +
            '\n' +
            '---\n' +
            '## Building and Launching Envhub\n' +
            '\n' +
            'I bought the domain `envhub.net` on July 3rd, and started working on it immediately. The vision was clear: create a solution that\'s as simple to use as GitHub but specifically designed for managing environment variables.\n' +
            '\n' +
            'I focused on making it incredibly simple to use from the terminal because that\'s where most developers, including myself, spend the majority of their time. The goal was to create a tool that feels natural in a developer\'s workflow, with commands that are intuitive and easy to remember.\n' +
            '\n' +
            'Security was my top priority from day one. I implemented end-to-end encryption to ensure that your environment variables are protected both in transit and at rest. The system is designed so that even I can\'t access your sensitive data. Authentication is handled securely, and all data is encrypted before it leaves your machine.\n' +
            '\n' +
            'After less than a month of intense development, I launched Envhub on Product Hunt to share it with the world.\n\n' +
            'To stay true to the open-source spirit that makes our community great, I made the project open source on GitHub. This not only allows others to verify the security of the implementation but also enables developers to contribute and help shape the future of the project.\n\n' +
            '## Learning from the Experts: Meeting with Senior Developers\n\n' +
            'During the development of Envhub, I had the incredible opportunity to meet with several senior developers and technical leads. Their feedback was invaluable in shaping the project.\n' +
            'Their feedback not only improved Envhub but also helped me grow as a developer. I learned that building in public and seeking feedback early can save countless hours of rework.\n\n' +
            '### Special Thanks\n' +
            'Big thanks to these amazing people who helped shape Envhub:\n\n' +
            '- **Muhammad Sufyian** (Co-Founder [@userhive.ai](https://userhive.ai)) - My mentor, whose guidance has been invaluable throughout this journey.\n' +
            '- **Rehan Sattar** (Lead Backend Engineer [@Lula Commerce](https://lulacommerce.com)) - For his helpful suggestions and support.\n\n' +
            'Their input helped improve Envhub and taught me the value of getting feedback early. A big thank you to both of them!\n\n' +
            '---\n' +
            '## How You Can Support\n' +
            '\n' +
            'If you found this story interesting or think Envhub could help you, here\'s how you can support me:\n' +
            '\n' +
            '- Star the [GitHub repo](https://github.com/Okaymisba/EnvHub)\n' +
            '- Upvote or leave a review on [Product Hunt](https://www.producthunt.com/products/envhub)\n' +
            '- Try it out and give [feedback](https://envhub.net/feedback)',
        publishedAt: '2025-08-01',
        author: {
            name: 'Misbah Sarfaraz',
            avatar: 'https://avatars.githubusercontent.com/u/177148571?s=400&u=a44eb25d2a64e43d25a019fab3bf9b1a1aae2b71&v=4',
        },
        coverImage: '/blog-1.png',
        tags: ['envhub', 'development', 'tools']
    },
    {
        id: '2',
        title: 'The Developer\'s Guide to Environment Variables: Best Practices and Pitfalls',
        slug: 'environment-variables-best-practices',
        excerpt: 'Learn the do\'s and don\'ts of managing environment variables in your projects with this comprehensive guide for developers of all levels.',
        content: '# The Developer\'s Guide to Environment Variables: Best Practices and Pitfalls\n\n' +
            'Environment variables are a fundamental part of modern development, yet they\'re often mishandled, leading to security vulnerabilities, configuration issues, and deployment headaches. In this guide, we\'ll explore best practices, common mistakes, and how tools like Envhub can help you manage them effectively.\n\n' +
            '## Why Environment Variables Matter\n\n' +
            'Environment variables serve several critical purposes in application development:\n\n' +
            '- **Security**: Keep sensitive information like API keys and database credentials out of your codebase\n' +
            '- **Configuration**: Adjust application behavior across different environments (development, staging, production)\n' +
            '- **Portability**: Make your application more portable across different deployment environments\n' +
            '- **Secrets Management**: Securely handle sensitive information without hardcoding\n\n' +
            '## Common Pitfalls to Avoid\n\n' +
            '### 1. Committing .env Files to Version Control\n\n' +
            '**The Mistake**: Accidentally committing `.env` files to Git.\n\n' +
            '**The Risk**: Exposes sensitive credentials if the repository is public or compromised.\n\n' +
            '**The Fix**:\n' +
            '```bash\n# .gitignore\n.env\n*.env\n.env.*\n!*.example\n```\n\n' +
            '### 2. Using Insecure Default Values\n\n' +
            '**The Mistake**: Using development credentials as defaults in your code.\n\n' +
            '**The Risk**: If an environment variable is missing, your app might use insecure defaults.\n\n' +
            '**The Fix**: Always require explicit configuration:\n' +
            '```javascript\n// Bad\nconst API_KEY = process.env.API_KEY || \'dev-key-123\';\n\n// Good\nconst API_KEY = process.env.API_KEY;\nif (!API_KEY) {\n  throw new Error(\'API_KEY environment variable is required\');\n}\n```\n\n' +
            '### 3. Not Validating Environment Variables\n\n' +
            '**The Mistake**: Assuming environment variables will always be correctly formatted.\n\n' +
            '**The Fix**: Validate environment variables at application startup. Consider using a library like `envalid` or `joi` for Node.js:\n' +
            '```javascript\nimport { cleanEnv, str, num } from \'envalid\';\n\nconst env = cleanEnv(process.env, {\n  NODE_ENV: str({ choices: [\'development\', \'test\', \'production\'] }),\n  PORT: num({ default: 3000 }),\n  API_KEY: str(),\n  DATABASE_URL: str(),\n});\n```\n\n' +
            '## Best Practices for Team Development\n\n' +
            '### 1. Use `.env.example` Files\n\n' +
            'Create a `.env.example` file that documents all required environment variables without including actual secrets. This serves as documentation and helps new team members get started quickly.\n\n' +
            '```env\n# .env.example\nDATABASE_URL=postgres://user:password@localhost:5432/dbname\nAPI_KEY=your_api_key_here\nNODE_ENV=development\n```\n\n' +
            '### 2. Document Environment Variables\n\n' +
            'Maintain documentation about what each environment variable does, acceptable values, and whether it\'s required. This can be in a `README.md` or dedicated documentation.\n\n' +
            '### 3. Use Different Files for Different Environments\n\n' +
            'Consider using different environment files for different environments. Many frameworks support this out of the box (e.g., `.env.development`, `.env.production`).\n\n' +
            '## Advanced: Environment Variables in Production\n\n' +
            '### 1. Use a Secrets Manager for Production\n\n' +
            'For production environments, consider using a dedicated secrets manager or a service like Envhub that provides:\n' +
            '- End-to-end encryption\n' +
            '- Access controls and audit logs\n' +
            '- Version history\n' +
            '- Team collaboration features\n\n' +
            '### 2. Rotate Secrets Regularly\n\n' +
            'Implement a process for rotating secrets and credentials. Many security breaches occur because credentials are never rotated.\n\n' +
            '## How Envhub Can Help\n\n' +
            'Managing environment variables across teams and environments can be challenging. [Envhub](https://envhub.net) simplifies this process by providing:\n' +
            '- **Secure Storage**: End-to-end encrypted environment variables\n' +
            '- **Team Collaboration**: Share environment configurations with team members\n' +
            '- **Version Control**: Track changes to your environment variables\n' +
            '- **CLI Integration**: Manage variables directly from your terminal\n\n' +
            '## Conclusion\n\n' +
            'Properly managing environment variables is crucial for application security and configuration. By following these best practices and using the right tools, you can avoid common pitfalls and create more secure, maintainable applications.\n\n' +
            'Remember: Environment variables are sensitive information. Treat them with the same care as you would any other credentials.\n\n',
        publishedAt: '2025-08-15',
        author: {
            name: 'Misbah Sarfaraz',
            avatar: 'https://avatars.githubusercontent.com/u/177148571?s=400&u=a44eb25d2a64e43d25a019fab3bf9b1a1aae2b71&v=4',
        },
        coverImage: '/developers_guide_to_envs.png',
        tags: ['environment-variables', 'security', 'devops', 'best-practices', 'development']
    },
    {
        id: '3',
        title: 'The Hidden Risks of Committing .env Files to GitHub',
        slug: 'hidden-risks-committing-env-files',
        excerpt: 'Learn why committing .env files to version control is dangerous and how to prevent accidental exposure of sensitive data.',
        content: '# The Hidden Risks of Committing .env Files to GitHub\n\n' +
            'If you\'ve worked on any modern software project, chances are you\'ve come across a `.env` file. These files are simple, yet powerful. They store environment variables—things like API keys, database credentials, tokens, and configuration details that your application needs to run.\n\n' +
            'But here\'s the catch: many developers accidentally commit `.env` files to GitHub (or other version control platforms). And when that happens, sensitive secrets become exposed to the world.\n\n' +
            '## Why Do Developers Use .env Files?\n\n' +
            '`.env` files exist to keep sensitive configuration out of your source code. Instead of hardcoding database passwords or API keys directly in your codebase, you store them in a separate file and load them at runtime.\n\n' +
            'For example:\n\n' +
            '```env\n' +
            'DATABASE_URL=postgres://user:password@localhost:5432/mydb\n' +
            'API_KEY=sk_live_123456789\n' +
            'SECRET_KEY=supersecretvalue\n' +
            '```\n\n' +
            'It\'s neat, convenient, and makes your application portable. But convenience often comes at a cost when these files are handled carelessly.\n\n' +
            '## The Risks of Committing .env Files\n\n' +
            '### Leaked API Keys\n' +
            'If an `.env` file is committed to a public repository, anyone on the internet can view it. Attackers often scan GitHub repositories automatically to find API keys and secrets.\n\n' +
            '### Financial Loss\n' +
            'Leaked credentials can be used to make unauthorized API calls. Developers have faced huge bills when their cloud keys were exposed and exploited for activities like running crypto miners.\n\n' +
            '### Data Breaches\n' +
            'Exposed database URLs can allow attackers to connect to your database, potentially stealing user data.\n\n' +
            '### Reputation Damage\n' +
            'A single leak can damage a startup\'s reputation. Customers and users may lose trust if they find out sensitive data was exposed.\n\n' +
            '## Real-World Examples\n\n' +
            '- In 2021, security researchers discovered thousands of API keys, tokens, and passwords committed to public repositories. Some were used to access cloud infrastructure.\n' +
            '- Multiple companies have faced major outages and data leaks simply because of a small `.env` file being pushed to GitHub.\n\n' +
            'The lesson? Even a single mistake can be costly.\n\n' +
            '## How to Prevent Committing .env Files\n\n' +
            '### 1. Add .env to .gitignore\n' +
            'The first step is simple: make sure `.env` files are ignored by Git.\n\n' +
            '```\n' +
            '.env\n' +
            '.env.*\n' +
            '```\n\n' +
            'This ensures that `.env` files won\'t be tracked by Git in the first place.\n\n' +
            '### 2. Use Example Files\n' +
            'Instead of sharing actual secrets, create a `.env.example` file with placeholder values. This helps new developers know what variables they need to set up without exposing sensitive information.\n\n' +
            '```env\n' +
            'DATABASE_URL=your_database_url_here\n' +
            'API_KEY=your_api_key_here\n' +
            'SECRET_KEY=your_secret_here\n' +
            '```\n\n' +
            '### 3. Use Secret Managers\n' +
            'Tools like EnvHub, HashiCorp Vault, Doppler, and AWS Secrets Manager provide secure storage and access control for environment variables. Instead of emailing `.env` files, you can share secrets safely with your team.\n\n' +
            '### 4. Rotate Keys Regularly\n' +
            'If you ever suspect that a key was exposed, rotate it immediately. Most platforms allow you to revoke and regenerate keys.\n\n' +
            '## Final Thoughts\n\n' +
            'Committing `.env` files to GitHub might seem like a small mistake, but its consequences can be enormous. From financial loss to security breaches, the risks are simply not worth it.\n\n' +
            'By using `.gitignore`, example files, and secret management tools, you can avoid these pitfalls and keep your team secure.\n\n' +
            'Remember: protecting your environment variables isn\'t just good practice—it\'s essential.',
        publishedAt: '2025-08-15',
        author: {
            name: 'Misbah Sarfaraz',
            avatar: 'https://avatars.githubusercontent.com/u/177148571?s=400&u=a44eb25d2a64e43d25a019fab3bf9b1a1aae2b71&v=4',
        },
        coverImage: '/env_leaks_in_github.png',
        tags: ['security', 'devops', 'best-practices', 'github']
    }
];
