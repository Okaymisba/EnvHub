# Security Policy

At Envhub, we take the security of our platform and our users seriously.  
We welcome responsible security research and encourage you to report vulnerabilities to us privately.


## Reporting a Vulnerability

Please use GitHub's **private vulnerability reporting feature** for this repository:

➡️ [Report a vulnerability](../../security/advisories/new)

This ensures your report is handled confidentially and securely within GitHub.  
⚠️ Do **not** open public issues or pull requests for security vulnerabilities.


## Scope

The scope of issues is limited to **technical vulnerabilities** in:

- **Envhub Web Application** (`envhub.net`)  
- **Envhub CLI Tool** (code maintained in our CLI repository)  

When testing, please:  
- Use **test accounts** and avoid impacting real user data  
- Avoid Denial of Service (DoS/DDoS) or spam attacks  
- Refrain from using automated tools that generate a high volume of traffic or disrupt availability


## Rewards

We value contributions from the security community and may provide rewards for responsibly disclosed vulnerabilities.  

- Rewards are discretionary and depend on the severity and impact of the issue.  
- Please note that, due to limited resources, reward amounts may be modest.  
- Acknowledgement in our release notes or project credits may also be offered as a token of appreciation.  

While we may not match the reward levels of large bug bounty platforms, your efforts are highly appreciated and help us improve the security of our project.


## Non-Qualifying Vulnerabilities

When reporting, please consider both:  
1. **Attack scenario / exploitability**  
2. **Security impact of the bug**  

The following issues are **out of scope** and will not be rewarded:  

- Reports generated exclusively using automated scanning tools without validation  
- Newly disclosed “0-day” or “zero-day” vulnerabilities published less than 30 days prior  
- Issues without a clear security impact, such as:  
  - Clickjacking on static pages without sensitive actions  
  - Missing security headers (e.g., CSP, X-Frame-Options)  
  - Descriptive error messages or verbose banners  
- Vulnerabilities affecting only outdated or unpatched browsers or platforms  
- Issues related to third-party services, software, or protocols outside Envhub’s control  
- CSRF on non-sensitive actions (e.g., logout, UI preferences)  
- Username/email enumeration without further security impact  
- **Self-XSS** (requiring the victim to paste malicious code into their own console)  
- **Open redirects** unless they can be chained into a meaningful exploit (e.g., credential theft, OAuth bypass)  
- Attacks requiring man-in-the-middle (MITM) or physical access to a user’s device  
- Reports of known vulnerable libraries **without a working proof of concept**  
- CSV/Excel injection without demonstrating an exploitable vulnerability  
- Weaknesses in SSL/TLS best practices without a working exploit  
- Service disruption or availability-based issues (DoS, lack of rate limiting, brute force without impact, etc.)  
- Content spoofing or text injection without the ability to modify HTML/CSS  
- Brute-forcing coupon/promo codes  
- Missing secure/HTTPOnly flags on non-sensitive cookies  
- Low-impact bugs requiring extremely unlikely user interaction (e.g., manually pasting an XSS payload)  
- Social media account takeovers or non-Envhub hosted assets  
- Credential leaks sourced from third-party breaches or dark web dumps  
- Outdated links or legacy endpoints with no security impact  


## Safe Harbor

Security researchers who follow this policy in good faith are authorized to engage in vulnerability research and testing against this repository.  
We will not pursue legal action provided that you:
- Report vulnerabilities through GitHub advisories
- Avoid privacy violations, data destruction, and service disruption
- Respect the confidentiality of your findings until a fix is released


Thank you for helping us keep Envhub safe and secure 💚
