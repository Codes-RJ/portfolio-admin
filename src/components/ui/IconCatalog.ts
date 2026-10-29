import { IconType } from 'react-icons';
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiCplusplus,
  SiC,
  SiGo,
  SiRust,
  SiPhp,
  SiRuby,
  SiKotlin,
  SiSwift,
  SiDart,
  SiR,
  SiJulia,
  SiHtml5,
  SiSass,
  SiGnubash,
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiTailwindcss,
  SiBootstrap,
  SiRedux,
  SiThreedotjs,
  SiVite,
  SiAstro,
  SiRemix,
  SiNodedotjs,
  SiExpress,
  SiDjango,
  SiFastapi,
  SiFlask,
  SiSpringboot,
  SiNestjs,
  SiGraphql,
  SiSocketdotio,
  SiPytorch,
  SiTensorflow,
  SiKeras,
  SiOpencv,
  SiScikitlearn,
  SiPandas,
  SiNumpy,
  SiHuggingface,
  SiJupyter,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiRedis,
  SiSqlite,
  SiElasticsearch,
  SiFirebase,
  SiSupabase,
  SiApachecassandra,
  SiNeo4J,
  SiPrisma,
  SiDocker,
  SiKubernetes,
  SiTerraform,
  SiLinux,
  SiNginx,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiGitlab,
  SiJenkins,
  SiCloudflare,
  SiVercel,
  SiNetlify,
  SiArduino,
  SiRaspberrypi,
  SiEspressif,
  SiMqtt,
  SiPostman,
  SiFigma,
  SiJira,
  SiNotion,
  SiCoursera,
  SiIeee,
  SiMeta,
  SiGooglecloud,
  SiKaggle,
  SiLeetcode,
  SiStripe,
  SiWebassembly,
  SiUbuntu,
  SiDebian,
  SiArchlinux
} from 'react-icons/si';

import {
  FaAws,
  FaMicrosoft,
  FaJava,
  FaMicrochip,
  FaRobot,
  FaWifi,
  FaBluetooth,
  FaDatabase,
  FaServer,
  FaCode,
  FaShieldHalved,
  FaGraduationCap,
  FaMedal,
  FaTrophy,
  FaPeopleGroup,
  FaPenFancy,
  FaLightbulb,
  FaBrain
} from 'react-icons/fa6';

import {
  TbBrandCSharp,
  TbBrandCss3,
  TbBrandVscode,
  TbBrandOpenai,
  TbCpu
} from 'react-icons/tb';

export interface IconItem {
  id: string;
  name: string;
  category: 'Languages' | 'Frontend' | 'Backend' | 'AI / ML' | 'Databases & Search' | 'Cloud & DevOps' | 'IoT & Hardware' | 'Tools & Workflows' | 'Certificates & Academics';
  Icon: IconType;
  color?: string;
  tags?: string[];
}

export const ICON_CATEGORIES = [
  'All',
  'Languages',
  'Frontend',
  'Backend',
  'AI / ML',
  'Databases & Search',
  'Cloud & DevOps',
  'IoT & Hardware',
  'Tools & Workflows',
  'Certificates & Academics'
] as const;

export const ICON_CATALOG: IconItem[] = [
  // 1. Programming Languages
  { id: 'SiTypescript', name: 'TypeScript', category: 'Languages', Icon: SiTypescript, color: '#3178C6', tags: ['ts', 'js', 'frontend', 'backend'] },
  { id: 'SiJavascript', name: 'JavaScript', category: 'Languages', Icon: SiJavascript, color: '#F7DF1E', tags: ['js', 'es6', 'web'] },
  { id: 'SiPython', name: 'Python', category: 'Languages', Icon: SiPython, color: '#3776AB', tags: ['py', 'ai', 'data', 'scripting'] },
  { id: 'FaJava', name: 'Java', category: 'Languages', Icon: FaJava, color: '#ED8B00', tags: ['jvm', 'spring', 'android'] },
  { id: 'SiCplusplus', name: 'C++', category: 'Languages', Icon: SiCplusplus, color: '#00599C', tags: ['cpp', 'systems', 'embedded', 'iot'] },
  { id: 'SiC', name: 'C Language', category: 'Languages', Icon: SiC, color: '#A8B9CC', tags: ['systems', 'microcontrollers', 'embedded'] },
  { id: 'TbBrandCSharp', name: 'C#', category: 'Languages', Icon: TbBrandCSharp, color: '#239120', tags: ['dotnet', 'unity', 'csharp'] },
  { id: 'SiGo', name: 'Go (Golang)', category: 'Languages', Icon: SiGo, color: '#00ADD8', tags: ['golang', 'backend', 'concurrency'] },
  { id: 'SiRust', name: 'Rust', category: 'Languages', Icon: SiRust, color: '#DEA584', tags: ['systems', 'memory-safe', 'wasm'] },
  { id: 'SiPhp', name: 'PHP', category: 'Languages', Icon: SiPhp, color: '#777BB4', tags: ['laravel', 'web', 'backend'] },
  { id: 'SiRuby', name: 'Ruby', category: 'Languages', Icon: SiRuby, color: '#CC342D', tags: ['rails', 'backend'] },
  { id: 'SiKotlin', name: 'Kotlin', category: 'Languages', Icon: SiKotlin, color: '#7F52FF', tags: ['android', 'jvm'] },
  { id: 'SiSwift', name: 'Swift', category: 'Languages', Icon: SiSwift, color: '#F05138', tags: ['ios', 'apple'] },
  { id: 'SiDart', name: 'Dart', category: 'Languages', Icon: SiDart, color: '#0175C2', tags: ['flutter', 'mobile'] },
  { id: 'SiR', name: 'R Language', category: 'Languages', Icon: SiR, color: '#276DC3', tags: ['statistics', 'analytics', 'data'] },
  { id: 'SiJulia', name: 'Julia', category: 'Languages', Icon: SiJulia, color: '#9558B2', tags: ['scientific', 'math', 'ml'] },
  { id: 'SiGnubash', name: 'Bash / Shell', category: 'Languages', Icon: SiGnubash, color: '#4EAA25', tags: ['terminal', 'linux', 'cli'] },
  { id: 'SiHtml5', name: 'HTML5', category: 'Languages', Icon: SiHtml5, color: '#E34F26', tags: ['markup', 'web'] },
  { id: 'TbBrandCss3', name: 'CSS3', category: 'Languages', Icon: TbBrandCss3, color: '#1572B6', tags: ['styling', 'ui', 'css'] },
  { id: 'SiWebassembly', name: 'WebAssembly (WASM)', category: 'Languages', Icon: SiWebassembly, color: '#654FF0', tags: ['wasm', 'performance'] },

  // 2. Frontend & Frameworks
  { id: 'SiReact', name: 'React', category: 'Frontend', Icon: SiReact, color: '#61DAFB', tags: ['reactjs', 'ui', 'components'] },
  { id: 'SiNextdotjs', name: 'Next.js', category: 'Frontend', Icon: SiNextdotjs, color: '#000000', tags: ['ssr', 'react', 'fullstack'] },
  { id: 'SiTailwindcss', name: 'Tailwind CSS', category: 'Frontend', Icon: SiTailwindcss, color: '#06B6D4', tags: ['css', 'styling', 'utility'] },
  { id: 'SiVuedotjs', name: 'Vue.js', category: 'Frontend', Icon: SiVuedotjs, color: '#4FC08D', tags: ['vue', 'spa'] },
  { id: 'SiAngular', name: 'Angular', category: 'Frontend', Icon: SiAngular, color: '#DD0031', tags: ['spa', 'typescript'] },
  { id: 'SiSvelte', name: 'Svelte / SvelteKit', category: 'Frontend', Icon: SiSvelte, color: '#FF3E00', tags: ['svelte', 'reactive'] },
  { id: 'SiRedux', name: 'Redux Toolkit', category: 'Frontend', Icon: SiRedux, color: '#764ABC', tags: ['state', 'react'] },
  { id: 'SiThreedotjs', name: 'Three.js / WebGL', category: 'Frontend', Icon: SiThreedotjs, color: '#000000', tags: ['3d', 'webgl', 'graphics'] },
  { id: 'SiVite', name: 'Vite', category: 'Frontend', Icon: SiVite, color: '#646CFF', tags: ['bundler', 'build'] },
  { id: 'SiAstro', name: 'Astro', category: 'Frontend', Icon: SiAstro, color: '#BC52EE', tags: ['ssg', 'static'] },
  { id: 'SiRemix', name: 'Remix', category: 'Frontend', Icon: SiRemix, color: '#000000', tags: ['react', 'web-standards'] },
  { id: 'SiBootstrap', name: 'Bootstrap', category: 'Frontend', Icon: SiBootstrap, color: '#7952B3', tags: ['css', 'responsive'] },
  { id: 'SiSass', name: 'Sass / SCSS', category: 'Frontend', Icon: SiSass, color: '#CC6699', tags: ['css', 'preprocessor'] },

  // 3. Backend & APIs
  { id: 'SiNodedotjs', name: 'Node.js', category: 'Backend', Icon: SiNodedotjs, color: '#5FA04E', tags: ['javascript', 'server', 'runtime'] },
  { id: 'SiExpress', name: 'Express.js', category: 'Backend', Icon: SiExpress, color: '#000000', tags: ['api', 'rest', 'node'] },
  { id: 'SiFastapi', name: 'FastAPI', category: 'Backend', Icon: SiFastapi, color: '#009688', tags: ['python', 'async', 'rest', 'ai'] },
  { id: 'SiDjango', name: 'Django', category: 'Backend', Icon: SiDjango, color: '#092E20', tags: ['python', 'web', 'orm'] },
  { id: 'SiFlask', name: 'Flask', category: 'Backend', Icon: SiFlask, color: '#000000', tags: ['python', 'microframework'] },
  { id: 'SiSpringboot', name: 'Spring Boot', category: 'Backend', Icon: SiSpringboot, color: '#6DB33F', tags: ['java', 'enterprise', 'microservices'] },
  { id: 'SiNestjs', name: 'NestJS', category: 'Backend', Icon: SiNestjs, color: '#E0234E', tags: ['typescript', 'node', 'architecture'] },
  { id: 'SiGraphql', name: 'GraphQL', category: 'Backend', Icon: SiGraphql, color: '#E10098', tags: ['api', 'query', 'schema'] },
  { id: 'SiSocketdotio', name: 'Socket.io / WebSockets', category: 'Backend', Icon: SiSocketdotio, color: '#010101', tags: ['realtime', 'chat', 'iot'] },
  { id: 'FaServer', name: 'Microservices & REST', category: 'Backend', Icon: FaServer, color: '#5B3FE8', tags: ['api', 'architecture'] },
  { id: 'FaCode', name: 'API Gateway & Middleware', category: 'Backend', Icon: FaCode, color: '#7C5DFA', tags: ['backend', 'routing'] },

  // 4. AI / ML & Data Science
  { id: 'SiPytorch', name: 'PyTorch', category: 'AI / ML', Icon: SiPytorch, color: '#EE4C2C', tags: ['deep-learning', 'torch', 'neural-networks'] },
  { id: 'SiTensorflow', name: 'TensorFlow', category: 'AI / ML', Icon: SiTensorflow, color: '#FF6F00', tags: ['keras', 'deep-learning', 'ai'] },
  { id: 'SiKeras', name: 'Keras', category: 'AI / ML', Icon: SiKeras, color: '#D00000', tags: ['neural-networks', 'ml'] },
  { id: 'SiHuggingface', name: 'Hugging Face / Transformers', category: 'AI / ML', Icon: SiHuggingface, color: '#FFD21E', tags: ['llm', 'nlp', 'models'] },
  { id: 'TbBrandOpenai', name: 'OpenAI & LLMs', category: 'AI / ML', Icon: TbBrandOpenai, color: '#10A37F', tags: ['gpt', 'ai', 'langchain'] },
  { id: 'SiOpencv', name: 'OpenCV (Computer Vision)', category: 'AI / ML', Icon: SiOpencv, color: '#5C3EE8', tags: ['vision', 'image-processing', 'yolo'] },
  { id: 'SiScikitlearn', name: 'Scikit-Learn', category: 'AI / ML', Icon: SiScikitlearn, color: '#F7931E', tags: ['ml', 'classification', 'algorithms'] },
  { id: 'SiPandas', name: 'Pandas', category: 'AI / ML', Icon: SiPandas, color: '#150458', tags: ['dataframe', 'analytics', 'python'] },
  { id: 'SiNumpy', name: 'NumPy', category: 'AI / ML', Icon: SiNumpy, color: '#013243', tags: ['matrix', 'math', 'tensors'] },
  { id: 'SiJupyter', name: 'Jupyter Notebooks', category: 'AI / ML', Icon: SiJupyter, color: '#F37626', tags: ['research', 'notebooks', 'data'] },
  { id: 'FaBrain', name: 'Deep Learning & Neural Nets', category: 'AI / ML', Icon: FaBrain, color: '#9333ea', tags: ['ai', 'intelligence', 'agents'] },
  { id: 'FaRobot', name: 'Autonomous Robotics & Vision', category: 'AI / ML', Icon: FaRobot, color: '#06b6d4', tags: ['robotics', 'automation'] },

  // 5. Databases & Search
  { id: 'SiPostgresql', name: 'PostgreSQL', category: 'Databases & Search', Icon: SiPostgresql, color: '#4169E1', tags: ['sql', 'relational', 'acid'] },
  { id: 'SiMongodb', name: 'MongoDB', category: 'Databases & Search', Icon: SiMongodb, color: '#47A248', tags: ['nosql', 'document', 'json'] },
  { id: 'SiRedis', name: 'Redis (In-Memory Cache)', category: 'Databases & Search', Icon: SiRedis, color: '#DC382D', tags: ['cache', 'pubsub', 'fast'] },
  { id: 'SiMysql', name: 'MySQL', category: 'Databases & Search', Icon: SiMysql, color: '#4479A1', tags: ['sql', 'rdbms'] },
  { id: 'SiSqlite', name: 'SQLite', category: 'Databases & Search', Icon: SiSqlite, color: '#003B57', tags: ['embedded', 'mobile', 'lightweight'] },
  { id: 'SiElasticsearch', name: 'Elasticsearch & Lucene', category: 'Databases & Search', Icon: SiElasticsearch, color: '#005571', tags: ['search', 'logs', 'vector-search'] },
  { id: 'SiSupabase', name: 'Supabase', category: 'Databases & Search', Icon: SiSupabase, color: '#3ECF8E', tags: ['baas', 'postgres', 'auth'] },
  { id: 'SiFirebase', name: 'Firebase', category: 'Databases & Search', Icon: SiFirebase, color: '#FFCA28', tags: ['firestore', 'realtime', 'auth'] },
  { id: 'SiPrisma', name: 'Prisma ORM', category: 'Databases & Search', Icon: SiPrisma, color: '#2D3748', tags: ['orm', 'database', 'typescript'] },
  { id: 'SiApachecassandra', name: 'Apache Cassandra', category: 'Databases & Search', Icon: SiApachecassandra, color: '#1287B1', tags: ['distributed', 'nosql', 'bigdata'] },
  { id: 'SiNeo4J', name: 'Neo4j Graph Database', category: 'Databases & Search', Icon: SiNeo4J, color: '#45818E', tags: ['graph', 'knowledge-graphs'] },
  { id: 'FaDatabase', name: 'SQL & Database Architecture', category: 'Databases & Search', Icon: FaDatabase, color: '#3b82f6', tags: ['indexing', 'optimization', 'dynamodb'] },

  // 6. Cloud, DevOps & Security
  { id: 'FaAws', name: 'Amazon Web Services (AWS)', category: 'Cloud & DevOps', Icon: FaAws, color: '#FF9900', tags: ['cloud', 'ec2', 's3', 'lambda'] },
  { id: 'SiGooglecloud', name: 'Google Cloud Platform (GCP)', category: 'Cloud & DevOps', Icon: SiGooglecloud, color: '#4285F4', tags: ['gcp', 'cloud', 'bigquery'] },
  { id: 'FaMicrosoft', name: 'Microsoft Azure', category: 'Cloud & DevOps', Icon: FaMicrosoft, color: '#0078D4', tags: ['azure', 'enterprise'] },
  { id: 'SiDocker', name: 'Docker Containers', category: 'Cloud & DevOps', Icon: SiDocker, color: '#2496ED', tags: ['containers', 'devops'] },
  { id: 'SiKubernetes', name: 'Kubernetes (K8s)', category: 'Cloud & DevOps', Icon: SiKubernetes, color: '#326CE5', tags: ['k8s', 'orchestration', 'cloud'] },
  { id: 'SiTerraform', name: 'Terraform (IaC)', category: 'Cloud & DevOps', Icon: SiTerraform, color: '#7B42BC', tags: ['iac', 'infrastructure'] },
  { id: 'SiLinux', name: 'Linux Kernel & Systems', category: 'Cloud & DevOps', Icon: SiLinux, color: '#FCC624', tags: ['os', 'sysadmin', 'kernel'] },
  { id: 'SiUbuntu', name: 'Ubuntu Server', category: 'Cloud & DevOps', Icon: SiUbuntu, color: '#E95420', tags: ['linux', 'distro'] },
  { id: 'SiDebian', name: 'Debian Linux', category: 'Cloud & DevOps', Icon: SiDebian, color: '#A81D33', tags: ['linux', 'server'] },
  { id: 'SiArchlinux', name: 'Arch Linux', category: 'Cloud & DevOps', Icon: SiArchlinux, color: '#1793D1', tags: ['linux', 'embedded'] },
  { id: 'SiNginx', name: 'NGINX Reverse Proxy', category: 'Cloud & DevOps', Icon: SiNginx, color: '#009639', tags: ['webserver', 'proxy', 'loadbalancer'] },
  { id: 'SiGithubactions', name: 'GitHub Actions CI/CD', category: 'Cloud & DevOps', Icon: SiGithubactions, color: '#2088FF', tags: ['cicd', 'automation', 'devops'] },
  { id: 'SiGitlab', name: 'GitLab CI', category: 'Cloud & DevOps', Icon: SiGitlab, color: '#FC6D26', tags: ['cicd', 'git'] },
  { id: 'SiJenkins', name: 'Jenkins CI/CD', category: 'Cloud & DevOps', Icon: SiJenkins, color: '#D24939', tags: ['automation', 'pipeline'] },
  { id: 'SiCloudflare', name: 'Cloudflare Edge & CDN', category: 'Cloud & DevOps', Icon: SiCloudflare, color: '#F38020', tags: ['cdn', 'dns', 'security', 'workers'] },
  { id: 'SiVercel', name: 'Vercel Deployment', category: 'Cloud & DevOps', Icon: SiVercel, color: '#000000', tags: ['hosting', 'edge', 'nextjs'] },
  { id: 'SiNetlify', name: 'Netlify', category: 'Cloud & DevOps', Icon: SiNetlify, color: '#00C7B7', tags: ['jamstack', 'deploy'] },
  { id: 'FaShieldHalved', name: 'Cyber Security & Network Auth', category: 'Cloud & DevOps', Icon: FaShieldHalved, color: '#10b981', tags: ['security', 'jwt', 'oauth'] },

  // 7. IoT, Hardware & Embedded Systems
  { id: 'SiArduino', name: 'Arduino Microcontrollers', category: 'IoT & Hardware', Icon: SiArduino, color: '#00979D', tags: ['embedded', 'sensors', 'c++'] },
  { id: 'SiRaspberrypi', name: 'Raspberry Pi Single Board', category: 'IoT & Hardware', Icon: SiRaspberrypi, color: '#C51A4A', tags: ['sbc', 'linux', 'arm', 'iot'] },
  { id: 'SiEspressif', name: 'ESP32 & ESP8266 SoC', category: 'IoT & Hardware', Icon: SiEspressif, color: '#E7352C', tags: ['wifi', 'bluetooth', 'iot', 'espressif'] },
  { id: 'SiMqtt', name: 'MQTT Protocol & Brokers', category: 'IoT & Hardware', Icon: SiMqtt, color: '#660066', tags: ['iot-messaging', 'telemetry', 'realtime'] },
  { id: 'FaMicrochip', name: 'Integrated Circuits & PCBs', category: 'IoT & Hardware', Icon: FaMicrochip, color: '#5B3FE8', tags: ['hardware', 'chips', 'electronics'] },
  { id: 'TbCpu', name: 'ARM & Embedded Processors', category: 'IoT & Hardware', Icon: TbCpu, color: '#0091BD', tags: ['microprocessor', 'architecture', 'cpu'] },
  { id: 'FaWifi', name: 'Wireless IoT & Mesh Networks', category: 'IoT & Hardware', Icon: FaWifi, color: '#3b82f6', tags: ['networking', 'zigbee', 'lora'] },
  { id: 'FaBluetooth', name: 'BLE (Bluetooth Low Energy)', category: 'IoT & Hardware', Icon: FaBluetooth, color: '#0082FC', tags: ['ble', 'wireless', 'beacons'] },
  { id: 'FaLightbulb', name: 'Smart Home & Telemetry', category: 'IoT & Hardware', Icon: FaLightbulb, color: '#f59e0b', tags: ['automation', 'iot'] },

  // 8. Tools & Workflows
  { id: 'SiGit', name: 'Git Version Control', category: 'Tools & Workflows', Icon: SiGit, color: '#F05032', tags: ['vcs', 'collaboration'] },
  { id: 'SiGithub', name: 'GitHub', category: 'Tools & Workflows', Icon: SiGithub, color: '#181717', tags: ['open-source', 'repos'] },
  { id: 'TbBrandVscode', name: 'VS Code IDE', category: 'Tools & Workflows', Icon: TbBrandVscode, color: '#007ACC', tags: ['editor', 'ide', 'vscode'] },
  { id: 'SiPostman', name: 'Postman API Suite', category: 'Tools & Workflows', Icon: SiPostman, color: '#FF6C37', tags: ['api-testing', 'documentation'] },
  { id: 'SiFigma', name: 'Figma UI/UX Design', category: 'Tools & Workflows', Icon: SiFigma, color: '#F24E1E', tags: ['prototyping', 'design', 'ui'] },
  { id: 'SiJira', name: 'Jira Agile Management', category: 'Tools & Workflows', Icon: SiJira, color: '#0052CC', tags: ['scrum', 'kanban'] },
  { id: 'SiNotion', name: 'Notion Documentation', category: 'Tools & Workflows', Icon: SiNotion, color: '#000000', tags: ['docs', 'wiki', 'notes'] },
  { id: 'SiKaggle', name: 'Kaggle ML Platform', category: 'Tools & Workflows', Icon: SiKaggle, color: '#20BEFF', tags: ['data-science', 'competitions'] },
  { id: 'SiLeetcode', name: 'LeetCode Algorithms', category: 'Tools & Workflows', Icon: SiLeetcode, color: '#FFA116', tags: ['dsa', 'problem-solving', 'competitive'] },
  { id: 'SiStripe', name: 'Stripe Payments', category: 'Tools & Workflows', Icon: SiStripe, color: '#008CDD', tags: ['fintech', 'billing'] },
  { id: 'SiMeta', name: 'Meta Technologies & React', category: 'Tools & Workflows', Icon: SiMeta, color: '#0668E1', tags: ['meta', 'facebook', 'frontend'] },

  // 9. Certificates & Academics
  { id: 'cert-aws', name: 'AWS Certified Solutions Architect', category: 'Certificates & Academics', Icon: FaAws, color: '#FF9900', tags: ['aws', 'amazon', 'cloud-arch'] },
  { id: 'cert-gcp', name: 'Google Cloud Professional Engineer', category: 'Certificates & Academics', Icon: SiGooglecloud, color: '#4285F4', tags: ['gcp', 'google', 'cloud'] },
  { id: 'cert-azure', name: 'Microsoft Azure Certified', category: 'Certificates & Academics', Icon: FaMicrosoft, color: '#0078D4', tags: ['azure', 'microsoft'] },
  { id: 'cert-meta', name: 'Meta Professional Frontend Developer', category: 'Certificates & Academics', Icon: SiMeta, color: '#0668E1', tags: ['meta', 'facebook', 'frontend', 'react'] },
  { id: 'cert-deeplearning', name: 'DeepLearning.AI Neural Networks', category: 'Certificates & Academics', Icon: FaBrain, color: '#EE4C2C', tags: ['ai', 'andrew-ng', 'dl', 'deeplearning'] },
  { id: 'cert-coursera', name: 'Coursera Verified Specialization', category: 'Certificates & Academics', Icon: SiCoursera, color: '#0056D2', tags: ['course', 'coursera', 'academics'] },
  { id: 'cert-ieee', name: 'IEEE Publication & Member', category: 'Certificates & Academics', Icon: SiIeee, color: '#00629B', tags: ['research', 'ieee', 'paper', 'publication'] },
  { id: 'cert-grad', name: 'Academic Degree & Honors', category: 'Certificates & Academics', Icon: FaGraduationCap, color: '#5B3FE8', tags: ['degree', 'university', 'btech', 'academics'] },
  { id: 'cert-medal', name: 'Hackathon Champion / Gold Medal', category: 'Certificates & Academics', Icon: FaMedal, color: '#F59E0B', tags: ['award', 'hackathon', 'first-place', 'gold'] },
  { id: 'cert-trophy', name: 'Innovation & Research Trophy', category: 'Certificates & Academics', Icon: FaTrophy, color: '#EAB308', tags: ['competition', 'fellowship', 'trophy'] },
  { id: 'honor-community', name: 'Community Contribution', category: 'Certificates & Academics', Icon: FaPeopleGroup, color: '#EAB308', tags: ['community', 'contribution', 'volunteer'] },
  { id: 'honor-writing', name: 'Technical Writing', category: 'Certificates & Academics', Icon: FaPenFancy, color: '#EAB308', tags: ['writing', 'publication', 'article'] },
  { id: 'SiIeee', name: 'IEEE Institute & Transactions', category: 'Certificates & Academics', Icon: SiIeee, color: '#00629B', tags: ['ieee', 'research'] },
  { id: 'SiCoursera', name: 'Coursera Accredited', category: 'Certificates & Academics', Icon: SiCoursera, color: '#0056D2', tags: ['coursera', 'specialization'] },
  { id: 'FaMedal', name: 'Honorary Medal Badge', category: 'Certificates & Academics', Icon: FaMedal, color: '#F59E0B', tags: ['medal', 'gold', 'hackathon'] },
  { id: 'FaGraduationCap', name: 'B.Tech University Degree', category: 'Certificates & Academics', Icon: FaGraduationCap, color: '#5B3FE8', tags: ['degree', 'btech', 'university'] }
];

export const findIconItem = (idOrName: string): IconItem | undefined => {
  if (!idOrName) return undefined;
  const target = idOrName.toLowerCase().trim();

  // 1. Exact ID or Name Match
  const exact = ICON_CATALOG.find(
    (item) => item.id.toLowerCase() === target || item.name.toLowerCase() === target
  );
  if (exact) return exact;

  // 2. Stripped prefix match (e.g. "cert-meta" -> "meta", "simeta" -> "meta")
  const stripped = target.replace(/^(cert-|si|fa|tb)/i, '');
  if (stripped.length >= 3) {
    const prefixMatch = ICON_CATALOG.find(
      (item) => item.id.toLowerCase().includes(stripped) || item.name.toLowerCase().includes(stripped)
    );
    if (prefixMatch) return prefixMatch;
  }

  // 3. Tag / Keyword Match
  const tagMatch = ICON_CATALOG.find((item) =>
    item.tags?.some((t) => target.includes(t.toLowerCase()) || t.toLowerCase().includes(target))
  );
  if (tagMatch) return tagMatch;

  // 4. Substring Match across Title / Description / Issuer words
  return ICON_CATALOG.find((item) =>
    item.name.toLowerCase().split(/[\s,&/-]+/).some((word) => word.length > 2 && target.includes(word))
  );
};
