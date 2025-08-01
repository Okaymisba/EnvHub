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
        tags: ['development', 'product', 'startup', 'devtools', 'envhub']
    }
];
