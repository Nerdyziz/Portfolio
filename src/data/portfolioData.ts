import { Project, SkillCategory, Achievement } from '../types';

export const portfolioConfig = {
  systemCode: 'AETHER // 01',
  systemStatus: 'NOMINAL',
  globalPing: '12ms',
  altitude: '10,000M',
  activeClusters: '128 ACTIVE',
  subAudioFreq: '432Hz',
  author: {
    role: 'Software Engineer × Applied AI/ML Specialist',
    tagline: 'ARCHITECTING SYSTEMS FROM CLOUD TO SILICON',
    bio: 'Software Engineer × Applied AI/ML Specialist. Orchestrating hyper-scale distributed infrastructure, low-level hardware optimization, and foundational neural networks with architectural clarity.',
    email: 'contact@aether-arch.dev',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    huggingface: 'https://huggingface.co',
    resumeUrl: '#cv'
  }
};

export const projectsData: Project[] = [
  {
    id: 'titan-mesh',
    code: 'SEC.02.01',
    title: 'TITAN-MESH // DISTRIBUTED INFERENCE FABRIC',
    tagline: 'Distributed low-latency orchestration fabric for multi-node LLM serving and speculative decoding.',
    description: 'High-throughput inference fabric engineered in Rust and C++ with custom CUDA kernels. Leverages zero-copy RDMA over Converged Ethernet (RoCE) to eliminate host-to-device memory copy bottlenecks across distributed GPU clusters.',
    architectureDetails: [
      'Kernel-bypass RDMA ring-buffer delivering sub-10ms TTFT under 20k concurrent requests',
      'Dynamic continuous batching scheduler with pipeline parallelism across 64 GPUs',
      'Custom FP8 scale-factor quantization engine yielding 3.8x throughput acceleration'
    ],
    metrics: [
      { label: 'THROUGHPUT', value: '18.4k req/s' },
      { label: 'P99 LATENCY', value: '12ms' },
      { label: 'MEMORY', value: 'ZERO-ALLOC' }
    ],
    stack: ['Rust', 'CUDA', 'gRPC', 'Raft', 'Kubernetes'],
    featured: true,
    githubUrl: 'https://github.com',
    liveUrl: 'https://github.com'
  },
  {
    id: 'aether-trace',
    code: 'SEC.02.02',
    title: 'AETHER-TRACE // PREDICTIVE TELEMETRY CORE',
    tagline: 'High-dimensional time-series anomaly detection engine utilizing contrastive temporal representations.',
    description: 'Self-supervised telemetry core processing 4TB+ of system metrics daily. Employs sparse multi-head temporal attention to predict cascading distributed microservice degradations up to 5 minutes prior to failure.',
    architectureDetails: [
      'Temporal Convolutional Networks with dynamic causality graph inference',
      'High-throughput ingestion layer over Apache Kafka & Apache Arrow Flight',
      'Sub-millisecond inference window operating on streaming metrics'
    ],
    metrics: [
      { label: 'THROUGHPUT', value: '4TB / Day' },
      { label: 'F1-SCORE', value: '0.991' },
      { label: 'WINDOW', value: '250μs' }
    ],
    stack: ['Python', 'PyTorch', 'Ray', 'FastAPI', 'Kafka'],
    featured: false,
    githubUrl: 'https://github.com',
    liveUrl: 'https://github.com'
  },
  {
    id: 'hyper-store',
    code: 'SEC.02.03',
    title: 'HYPER-STORE // KERNEL-BYPASS DISTRIBUTED STORAGE',
    tagline: 'LSM-tree key-value engine with asynchronous io_uring disk I/O and Raft consensus.',
    description: 'Distributed persistence layer built from scratch to maximize NVMe bandwidth. Utilizes Linux io_uring submission queues and lock-free concurrency primitives to achieve ultra-consistent microsecond latency.',
    architectureDetails: [
      'Lock-free arena memory allocators to completely bypass runtime GC overhead',
      'Asynchronous write-ahead logging (WAL) over raw NVMe block devices',
      'Multi-Raft leader rebalancing with automated partition recovery'
    ],
    metrics: [
      { label: 'CAPACITY', value: '250 PB' },
      { label: 'IOPS', value: '500k / Node' },
      { label: 'NETWORK', value: '100GbE RoCE' }
    ],
    stack: ['Go', 'C', 'io_uring', 'eBPF', 'Raft'],
    featured: true,
    githubUrl: 'https://github.com',
    liveUrl: 'https://github.com'
  }
];

export const skillCategories: SkillCategory[] = [
  {
    id: 'distributed-arch',
    title: 'DISTRIBUTED ARCH',
    iconName: 'Server',
    level: 5,
    skills: ['Rust', 'Go', 'Raft Consensus', 'Apache Kafka', 'gRPC / Protobuf']
  },
  {
    id: 'ml-ai',
    title: 'MACHINE LEARNING',
    iconName: 'Brain',
    level: 5,
    skills: ['PyTorch', 'TensorRT', 'CUDA Optimization', 'Transformers & LLMs', 'JAX']
  },
  {
    id: 'systems-kernel',
    title: 'SYSTEMS / HARDWARE',
    iconName: 'Cpu',
    level: 4,
    skills: ['C / C++', 'Linux Kernel & eBPF', 'io_uring', 'Memory Management', 'x86/ARM Assembly']
  },
  {
    id: 'cloud-observability',
    title: 'CLOUD & INFRA',
    iconName: 'Cloud',
    level: 4,
    skills: ['Kubernetes', 'Docker', 'AWS / GCP Architecture', 'Terraform', 'Prometheus']
  }
];

export const achievementsData: Achievement[] = [
  {
    id: 'ach-1',
    year: '2025',
    type: 'GLOBAL SUMMIT',
    title: 'Grand Champion // Global AI Hackathon',
    description: 'Architected a decentralized edge inference framework in 36 hours. Scored highest in latency efficiency, throughput scalability, and multimodal streaming accuracy.'
  },
  {
    id: 'ach-2',
    year: '2024',
    type: 'IEEE CONFERENCE',
    title: 'Published IEEE Research // Dynamic Attention Quantization',
    description: 'Co-authored paper introducing dynamic scaling algorithms for 4-bit matrix multiplication in transformer attention layers, decreasing latency by 28%.'
  },
  {
    id: 'ach-3',
    year: '2023',
    type: 'OPEN SOURCE',
    title: 'Apache Core Contributor // High-Volume Stream Framework',
    description: 'Contributed 20+ performance PRs optimizing zero-copy buffer recycling and socket pooling for large-scale distributed streaming pipelines.'
  }
];
