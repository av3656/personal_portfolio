import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaDatabase } from 'react-icons/fa'
import { FaHardDrive, FaLock, FaServer } from 'react-icons/fa6'
import { SiApachekafka, SiPostgresql, SiRedis, SiSpringboot } from 'react-icons/si'
import { Reveal } from '../components/ui/Reveal'

const NODE_WIDTH = 158
const NODE_HEIGHT = 62
const EVOLUTION_STEP_MS = 3800
const PULSE_SEGMENT_DURATION_MS = 2000
const SCALE_STAGE_MS = 2000
const MIN_NODE_SPACING = 140
const BACKEND_VERTICAL_SPACING = 70
const QUEUE_HORIZONTAL_SPACING = 120
const DB_REPLICA_SPACING = 110

const BASE_NODES = [
  {
    id: 'client',
    label: 'Client (Browser)',
    icon: FaHardDrive,
    description: 'Entry point where users interact with your frontend application.',
  },
  {
    id: 'loadBalancer',
    label: 'Load Balancer',
    icon: FaServer,
    description: 'Distributes incoming traffic across services for reliability.',
  },
  {
    id: 'apiGateway',
    label: 'API Gateway',
    icon: FaServer,
    description: 'Routes requests, enforces policies, and centralizes API management.',
  },
  {
    id: 'backend',
    label: 'Java Backend',
    icon: SiSpringboot,
    description: 'Runs Spring Boot services with core business logic and orchestration.',
  },
  {
    id: 'auth',
    label: 'Authentication',
    icon: FaLock,
    description: 'Validates identities, issues tokens, and protects secure endpoints.',
  },
  {
    id: 'database',
    label: 'PostgreSQL',
    icon: SiPostgresql,
    description: 'Primary relational data store for durable transactional records.',
  },
  {
    id: 'cache',
    label: 'Cache (Redis)',
    icon: SiRedis,
    description: 'Serves hot data quickly to reduce latency and database load.',
  },
  {
    id: 'queue',
    label: 'Message Queue',
    icon: SiApachekafka,
    description: 'Asynchronous event backbone for scalable service communication.',
  },
  {
    id: 'storage',
    label: 'File Storage (S3)',
    icon: FaDatabase,
    description: 'Stores static files and artifacts with high durability.',
  },
]

const SCALE_EXTRA_NODES = [
  {
    id: 'backend1',
    label: 'Backend Instance 1',
    icon: SiSpringboot,
    description: 'Horizontal scaling instance for API compute.',
  },
  {
    id: 'backend2',
    label: 'Backend Instance 2',
    icon: SiSpringboot,
    description: 'Horizontal scaling instance for API compute.',
  },
  {
    id: 'backend3',
    label: 'Backend Instance 3',
    icon: SiSpringboot,
    description: 'Horizontal scaling instance for API compute.',
  },
  {
    id: 'backend4',
    label: 'Backend Instance 4',
    icon: SiSpringboot,
    description: 'Horizontal scaling instance for API compute.',
  },
  {
    id: 'backend5',
    label: 'Backend Instance 5',
    icon: SiSpringboot,
    description: 'Horizontal scaling instance for API compute.',
  },
  {
    id: 'backend6',
    label: 'Backend Instance 6',
    icon: SiSpringboot,
    description: 'Horizontal scaling instance for API compute.',
  },
  {
    id: 'loadBalancer2',
    label: 'Load Balancer 2',
    icon: FaServer,
    description: 'Secondary balancer for high-volume traffic distribution.',
  },
  {
    id: 'dbPrimary',
    label: 'PostgreSQL Primary',
    icon: SiPostgresql,
    description: 'Primary write database node.',
  },
  {
    id: 'dbReplica1',
    label: 'PostgreSQL Replica 1',
    icon: SiPostgresql,
    description: 'Read replica handling read-heavy traffic.',
  },
  {
    id: 'dbReplica2',
    label: 'PostgreSQL Replica 2',
    icon: SiPostgresql,
    description: 'Read replica handling read-heavy traffic.',
  },
  {
    id: 'dbReplica3',
    label: 'PostgreSQL Replica 3',
    icon: SiPostgresql,
    description: 'Read replica handling read-heavy traffic.',
  },
  {
    id: 'workerA',
    label: 'Worker Service A',
    icon: FaServer,
    description: 'Asynchronous worker processing queue tasks.',
  },
  {
    id: 'workerB',
    label: 'Worker Service B',
    icon: FaServer,
    description: 'Asynchronous worker processing queue tasks.',
  },
  {
    id: 'queue2',
    label: 'Kafka Queue 2',
    icon: SiApachekafka,
    description: 'Secondary queue partition for burst traffic.',
  },
  {
    id: 'cdn',
    label: 'CDN / Edge',
    icon: FaHardDrive,
    description: 'Edge layer reducing latency for global users.',
  },
]

const ALL_NODES = [...BASE_NODES, ...SCALE_EXTRA_NODES]
const NODE_MAP = ALL_NODES.reduce((acc, node) => {
  acc[node.id] = node
  return acc
}, {})

const BASE_CONNECTIONS = [
  ['client', 'loadBalancer'],
  ['loadBalancer', 'apiGateway'],
  ['apiGateway', 'backend'],
  ['backend', 'auth'],
  ['backend', 'database'],
  ['backend', 'cache'],
  ['backend', 'queue'],
  ['queue', 'storage'],
]

const DESKTOP_LAYOUT = {
  client: { x: 8, y: 45 },
  loadBalancer: { x: 24, y: 45 },
  apiGateway: { x: 40, y: 45 },
  backend: { x: 56, y: 45 },
  auth: { x: 56, y: 22 },
  database: { x: 77, y: 34 },
  cache: { x: 77, y: 56 },
  queue: { x: 66, y: 70 },
  storage: { x: 86, y: 70 },
}

const TABLET_LAYOUT = {
  client: { x: 10, y: 40 },
  loadBalancer: { x: 28, y: 40 },
  apiGateway: { x: 46, y: 40 },
  backend: { x: 64, y: 40 },
  auth: { x: 64, y: 19 },
  database: { x: 80, y: 32 },
  cache: { x: 80, y: 54 },
  queue: { x: 58, y: 70 },
  storage: { x: 80, y: 70 },
}

const MOBILE_LAYOUT = {
  client: { x: 50, y: 12 },
  loadBalancer: { x: 50, y: 23 },
  apiGateway: { x: 50, y: 34 },
  backend: { x: 50, y: 45 },
  auth: { x: 50, y: 56 },
  database: { x: 50, y: 67 },
  cache: { x: 50, y: 78 },
  queue: { x: 50, y: 89 },
  storage: { x: 50, y: 98 },
}

const EVOLUTION_STAGES = [
  {
    client: { x: 20, y: 48 },
    backend: { x: 50, y: 48 },
    database: { x: 80, y: 48 },
    apiGateway: { x: 35, y: 22 },
    loadBalancer: { x: 18, y: 22 },
    auth: { x: 53, y: 24 },
    cache: { x: 78, y: 30 },
    queue: { x: 62, y: 74 },
    storage: { x: 84, y: 74 },
  },
  DESKTOP_LAYOUT,
  {
    client: { x: 10, y: 45 },
    loadBalancer: { x: 26, y: 36 },
    apiGateway: { x: 42, y: 45 },
    backend: { x: 58, y: 55 },
    auth: { x: 58, y: 28 },
    database: { x: 78, y: 40 },
    cache: { x: 78, y: 62 },
    queue: { x: 62, y: 75 },
    storage: { x: 86, y: 75 },
  },
]

const SCALE_STAGES = [
  {
    visible: ['client', 'backend', 'database'],
    connections: [
      ['client', 'backend'],
      ['backend', 'database'],
    ],
    layout: {
      client: { x: 18, y: 50 },
      backend: { x: 50, y: 50 },
      database: { x: 82, y: 50 },
    },
    routeOptions: [['client', 'backend', 'database']],
    spawnInterval: 1200,
  },
  {
    visible: ['client', 'loadBalancer', 'backend1', 'backend2', 'backend3', 'database'],
    connections: [
      ['client', 'loadBalancer'],
      ['loadBalancer', 'backend1'],
      ['loadBalancer', 'backend2'],
      ['loadBalancer', 'backend3'],
      ['backend1', 'database'],
      ['backend2', 'database'],
      ['backend3', 'database'],
    ],
    layout: {
      client: { x: 10, y: 50 },
      loadBalancer: { x: 28, y: 50 },
      backend1: { x: 48, y: 34 },
      backend2: { x: 48, y: 50 },
      backend3: { x: 48, y: 66 },
      database: { x: 78, y: 50 },
    },
    routeOptions: [
      ['client', 'loadBalancer', 'backend1', 'database'],
      ['client', 'loadBalancer', 'backend2', 'database'],
      ['client', 'loadBalancer', 'backend3', 'database'],
    ],
    spawnInterval: 950,
  },
  {
    visible: ['client', 'apiGateway', 'loadBalancer', 'backend1', 'backend2', 'backend3', 'database'],
    connections: [
      ['client', 'apiGateway'],
      ['apiGateway', 'loadBalancer'],
      ['loadBalancer', 'backend1'],
      ['loadBalancer', 'backend2'],
      ['loadBalancer', 'backend3'],
      ['backend1', 'database'],
      ['backend2', 'database'],
      ['backend3', 'database'],
    ],
    layout: {
      client: { x: 8, y: 50 },
      apiGateway: { x: 24, y: 50 },
      loadBalancer: { x: 40, y: 50 },
      backend1: { x: 58, y: 34 },
      backend2: { x: 58, y: 50 },
      backend3: { x: 58, y: 66 },
      database: { x: 82, y: 50 },
    },
    routeOptions: [
      ['client', 'apiGateway', 'loadBalancer', 'backend1', 'database'],
      ['client', 'apiGateway', 'loadBalancer', 'backend2', 'database'],
      ['client', 'apiGateway', 'loadBalancer', 'backend3', 'database'],
    ],
    spawnInterval: 700,
  },
  {
    visible: ['client', 'apiGateway', 'loadBalancer', 'backend1', 'backend2', 'backend3', 'cache', 'database'],
    connections: [
      ['client', 'apiGateway'],
      ['apiGateway', 'loadBalancer'],
      ['loadBalancer', 'backend1'],
      ['loadBalancer', 'backend2'],
      ['loadBalancer', 'backend3'],
      ['backend1', 'cache'],
      ['backend2', 'cache'],
      ['backend3', 'cache'],
      ['backend1', 'database'],
      ['backend2', 'database'],
      ['backend3', 'database'],
    ],
    layout: {
      client: { x: 8, y: 50 },
      apiGateway: { x: 24, y: 50 },
      loadBalancer: { x: 40, y: 50 },
      backend1: { x: 58, y: 34 },
      backend2: { x: 58, y: 50 },
      backend3: { x: 58, y: 66 },
      cache: { x: 77, y: 36 },
      database: { x: 82, y: 62 },
    },
    routeOptions: [
      ['client', 'apiGateway', 'loadBalancer', 'backend1', 'cache'],
      ['client', 'apiGateway', 'loadBalancer', 'backend2', 'cache'],
      ['client', 'apiGateway', 'loadBalancer', 'backend3', 'cache'],
      ['client', 'apiGateway', 'loadBalancer', 'backend1', 'database'],
      ['client', 'apiGateway', 'loadBalancer', 'backend2', 'database'],
      ['client', 'apiGateway', 'loadBalancer', 'backend3', 'database'],
    ],
    spawnInterval: 560,
  },
  {
    visible: [
      'client',
      'apiGateway',
      'loadBalancer',
      'backend1',
      'backend2',
      'backend3',
      'cache',
      'dbPrimary',
      'dbReplica1',
      'dbReplica2',
    ],
    connections: [
      ['client', 'apiGateway'],
      ['apiGateway', 'loadBalancer'],
      ['loadBalancer', 'backend1'],
      ['loadBalancer', 'backend2'],
      ['loadBalancer', 'backend3'],
      ['backend1', 'cache'],
      ['backend2', 'cache'],
      ['backend3', 'cache'],
      ['backend1', 'dbPrimary'],
      ['backend2', 'dbPrimary'],
      ['backend3', 'dbPrimary'],
      ['backend1', 'dbReplica1'],
      ['backend2', 'dbReplica2'],
      ['backend3', 'dbReplica1'],
    ],
    layout: {
      client: { x: 6, y: 50 },
      apiGateway: { x: 20, y: 50 },
      loadBalancer: { x: 34, y: 50 },
      backend1: { x: 50, y: 34 },
      backend2: { x: 50, y: 50 },
      backend3: { x: 50, y: 66 },
      cache: { x: 68, y: 34 },
      dbPrimary: { x: 82, y: 50 },
      dbReplica1: { x: 68, y: 66 },
      dbReplica2: { x: 82, y: 72 },
    },
    routeOptions: [
      ['client', 'apiGateway', 'loadBalancer', 'backend1', 'cache'],
      ['client', 'apiGateway', 'loadBalancer', 'backend2', 'cache'],
      ['client', 'apiGateway', 'loadBalancer', 'backend3', 'cache'],
      ['client', 'apiGateway', 'loadBalancer', 'backend1', 'dbPrimary'],
      ['client', 'apiGateway', 'loadBalancer', 'backend2', 'dbReplica1'],
      ['client', 'apiGateway', 'loadBalancer', 'backend3', 'dbReplica2'],
    ],
    spawnInterval: 420,
  },
  {
    visible: [
      'client',
      'apiGateway',
      'loadBalancer',
      'backend1',
      'backend2',
      'backend3',
      'cache',
      'dbPrimary',
      'dbReplica1',
      'dbReplica2',
      'queue',
      'workerA',
      'workerB',
    ],
    connections: [
      ['client', 'apiGateway'],
      ['apiGateway', 'loadBalancer'],
      ['loadBalancer', 'backend1'],
      ['loadBalancer', 'backend2'],
      ['loadBalancer', 'backend3'],
      ['backend1', 'cache'],
      ['backend2', 'cache'],
      ['backend3', 'cache'],
      ['backend1', 'dbPrimary'],
      ['backend2', 'dbReplica1'],
      ['backend3', 'dbReplica2'],
      ['backend1', 'queue'],
      ['backend2', 'queue'],
      ['backend3', 'queue'],
      ['queue', 'workerA'],
      ['queue', 'workerB'],
    ],
    layout: {
      client: { x: 6, y: 50 },
      apiGateway: { x: 19, y: 50 },
      loadBalancer: { x: 32, y: 50 },
      backend1: { x: 46, y: 34 },
      backend2: { x: 46, y: 50 },
      backend3: { x: 46, y: 66 },
      cache: { x: 62, y: 31 },
      dbPrimary: { x: 76, y: 44 },
      dbReplica1: { x: 74, y: 62 },
      dbReplica2: { x: 86, y: 62 },
      queue: { x: 62, y: 74 },
      workerA: { x: 78, y: 78 },
      workerB: { x: 90, y: 78 },
    },
    routeOptions: [
      ['client', 'apiGateway', 'loadBalancer', 'backend1', 'cache'],
      ['client', 'apiGateway', 'loadBalancer', 'backend2', 'dbReplica1'],
      ['client', 'apiGateway', 'loadBalancer', 'backend3', 'dbReplica2'],
      ['client', 'apiGateway', 'loadBalancer', 'backend1', 'queue', 'workerA'],
      ['client', 'apiGateway', 'loadBalancer', 'backend2', 'queue', 'workerB'],
      ['client', 'apiGateway', 'loadBalancer', 'backend3', 'queue', 'workerA'],
    ],
    spawnInterval: 320,
  },
  {
    visible: [
      'client',
      'cdn',
      'apiGateway',
      'loadBalancer',
      'backend1',
      'backend2',
      'backend3',
      'cache',
      'dbPrimary',
      'dbReplica1',
      'dbReplica2',
      'queue',
      'workerA',
      'workerB',
    ],
    connections: [
      ['client', 'cdn'],
      ['cdn', 'apiGateway'],
      ['apiGateway', 'loadBalancer'],
      ['loadBalancer', 'backend1'],
      ['loadBalancer', 'backend2'],
      ['loadBalancer', 'backend3'],
      ['backend1', 'cache'],
      ['backend2', 'cache'],
      ['backend3', 'cache'],
      ['backend1', 'dbPrimary'],
      ['backend2', 'dbReplica1'],
      ['backend3', 'dbReplica2'],
      ['backend1', 'queue'],
      ['backend2', 'queue'],
      ['backend3', 'queue'],
      ['queue', 'workerA'],
      ['queue', 'workerB'],
    ],
    layout: {
      client: { x: 4, y: 50 },
      cdn: { x: 14, y: 50 },
      apiGateway: { x: 26, y: 50 },
      loadBalancer: { x: 38, y: 50 },
      backend1: { x: 52, y: 34 },
      backend2: { x: 52, y: 50 },
      backend3: { x: 52, y: 66 },
      cache: { x: 68, y: 30 },
      dbPrimary: { x: 84, y: 42 },
      dbReplica1: { x: 74, y: 62 },
      dbReplica2: { x: 86, y: 64 },
      queue: { x: 66, y: 76 },
      workerA: { x: 80, y: 78 },
      workerB: { x: 92, y: 78 },
    },
    routeOptions: [
      ['client', 'cdn', 'apiGateway', 'loadBalancer', 'backend1', 'cache'],
      ['client', 'cdn', 'apiGateway', 'loadBalancer', 'backend2', 'dbReplica1'],
      ['client', 'cdn', 'apiGateway', 'loadBalancer', 'backend3', 'dbReplica2'],
      ['client', 'cdn', 'apiGateway', 'loadBalancer', 'backend1', 'queue', 'workerA'],
      ['client', 'cdn', 'apiGateway', 'loadBalancer', 'backend2', 'queue', 'workerB'],
      ['client', 'cdn', 'apiGateway', 'loadBalancer', 'backend3', 'dbPrimary'],
    ],
    spawnInterval: 240,
  },
]

const ATTACK_STAGES = [
  {
    label: 'normal',
    visible: ['client', 'backend', 'database'],
    connections: [
      ['client', 'backend'],
      ['backend', 'database'],
    ],
    layout: {
      client: { x: 18, y: 50 },
      backend: { x: 50, y: 50 },
      database: { x: 82, y: 50 },
    },
    routeOptions: [['client', 'backend', 'database']],
    spawnInterval: 1100,
  },
  {
    label: '100k',
    visible: ['client', 'loadBalancer', 'backend1', 'backend2', 'backend3', 'cache', 'database'],
    connections: [
      ['client', 'loadBalancer'],
      ['loadBalancer', 'backend1'],
      ['loadBalancer', 'backend2'],
      ['loadBalancer', 'backend3'],
      ['backend1', 'cache'],
      ['backend2', 'cache'],
      ['backend3', 'database'],
    ],
    layout: {
      client: { x: 8, y: 50 },
      loadBalancer: { x: 28, y: 50 },
      backend1: { x: 50, y: 34 },
      backend2: { x: 50, y: 50 },
      backend3: { x: 50, y: 66 },
      cache: { x: 76, y: 40 },
      database: { x: 80, y: 62 },
    },
    routeOptions: [
      ['client', 'loadBalancer', 'backend1', 'cache'],
      ['client', 'loadBalancer', 'backend2', 'cache'],
      ['client', 'loadBalancer', 'backend3', 'database'],
    ],
    spawnInterval: 620,
  },
  {
    label: '1m',
    visible: ['client', 'apiGateway', 'loadBalancer', 'backend1', 'backend2', 'backend3', 'cache', 'database'],
    connections: [
      ['client', 'apiGateway'],
      ['apiGateway', 'loadBalancer'],
      ['loadBalancer', 'backend1'],
      ['loadBalancer', 'backend2'],
      ['loadBalancer', 'backend3'],
      ['backend1', 'cache'],
      ['backend2', 'cache'],
      ['backend3', 'database'],
    ],
    layout: {
      client: { x: 6, y: 50 },
      apiGateway: { x: 22, y: 50 },
      loadBalancer: { x: 38, y: 50 },
      backend1: { x: 54, y: 34 },
      backend2: { x: 54, y: 50 },
      backend3: { x: 54, y: 66 },
      cache: { x: 74, y: 38 },
      database: { x: 84, y: 62 },
    },
    routeOptions: [
      ['client', 'apiGateway', 'loadBalancer', 'backend1', 'cache'],
      ['client', 'apiGateway', 'loadBalancer', 'backend2', 'cache'],
      ['client', 'apiGateway', 'loadBalancer', 'backend3', 'database'],
    ],
    spawnInterval: 360,
  },
  {
    label: 'db-pressure',
    visible: [
      'client',
      'apiGateway',
      'loadBalancer',
      'backend1',
      'backend2',
      'backend3',
      'cache',
      'dbPrimary',
      'dbReplica1',
      'dbReplica2',
    ],
    connections: [
      ['client', 'apiGateway'],
      ['apiGateway', 'loadBalancer'],
      ['loadBalancer', 'backend1'],
      ['loadBalancer', 'backend2'],
      ['loadBalancer', 'backend3'],
      ['backend1', 'cache'],
      ['backend2', 'cache'],
      ['backend3', 'dbPrimary'],
      ['backend1', 'dbReplica1'],
      ['backend2', 'dbReplica2'],
    ],
    layout: {
      client: { x: 6, y: 50 },
      apiGateway: { x: 20, y: 50 },
      loadBalancer: { x: 34, y: 50 },
      backend1: { x: 48, y: 34 },
      backend2: { x: 48, y: 50 },
      backend3: { x: 48, y: 66 },
      cache: { x: 65, y: 34 },
      dbPrimary: { x: 82, y: 48 },
      dbReplica1: { x: 70, y: 66 },
      dbReplica2: { x: 82, y: 68 },
    },
    routeOptions: [
      ['client', 'apiGateway', 'loadBalancer', 'backend1', 'cache'],
      ['client', 'apiGateway', 'loadBalancer', 'backend2', 'dbReplica1'],
      ['client', 'apiGateway', 'loadBalancer', 'backend3', 'dbPrimary'],
      ['client', 'apiGateway', 'loadBalancer', 'backend2', 'dbReplica2'],
    ],
    spawnInterval: 240,
  },
  {
    label: '10m',
    visible: [
      'client',
      'cdn',
      'apiGateway',
      'loadBalancer',
      'loadBalancer2',
      'backend1',
      'backend2',
      'backend3',
      'backend4',
      'backend5',
      'backend6',
      'cache',
      'queue',
      'queue2',
      'workerA',
      'workerB',
      'dbPrimary',
      'dbReplica1',
      'dbReplica2',
      'dbReplica3',
    ],
    connections: [
      ['client', 'cdn'],
      ['cdn', 'apiGateway'],
      ['apiGateway', 'loadBalancer'],
      ['apiGateway', 'loadBalancer2'],
      ['loadBalancer', 'backend1'],
      ['loadBalancer', 'backend2'],
      ['loadBalancer', 'backend3'],
      ['loadBalancer2', 'backend4'],
      ['loadBalancer2', 'backend5'],
      ['loadBalancer2', 'backend6'],
      ['backend1', 'cache'],
      ['backend2', 'cache'],
      ['backend3', 'dbReplica1'],
      ['backend4', 'dbReplica2'],
      ['backend5', 'dbPrimary'],
      ['backend6', 'dbReplica3'],
      ['backend1', 'queue'],
      ['backend2', 'queue2'],
      ['backend4', 'queue2'],
      ['queue', 'workerA'],
      ['queue2', 'workerB'],
    ],
    layout: {
      client: { x: 4, y: 50 },
      cdn: { x: 14, y: 50 },
      apiGateway: { x: 24, y: 50 },
      loadBalancer: { x: 34, y: 38 },
      loadBalancer2: { x: 34, y: 64 },
      backend1: { x: 48, y: 28 },
      backend2: { x: 48, y: 40 },
      backend3: { x: 48, y: 52 },
      backend4: { x: 48, y: 64 },
      backend5: { x: 48, y: 76 },
      backend6: { x: 62, y: 76 },
      cache: { x: 63, y: 30 },
      queue: { x: 64, y: 58 },
      queue2: { x: 64, y: 72 },
      workerA: { x: 80, y: 56 },
      workerB: { x: 80, y: 72 },
      dbPrimary: { x: 82, y: 40 },
      dbReplica1: { x: 74, y: 52 },
      dbReplica2: { x: 82, y: 58 },
      dbReplica3: { x: 90, y: 52 },
    },
    routeOptions: [
      ['client', 'cdn', 'apiGateway', 'loadBalancer', 'backend1', 'cache'],
      ['client', 'cdn', 'apiGateway', 'loadBalancer', 'backend2', 'dbReplica1'],
      ['client', 'cdn', 'apiGateway', 'loadBalancer2', 'backend4', 'dbReplica2'],
      ['client', 'cdn', 'apiGateway', 'loadBalancer2', 'backend5', 'dbPrimary'],
      ['client', 'cdn', 'apiGateway', 'loadBalancer2', 'backend6', 'dbReplica3'],
      ['client', 'cdn', 'apiGateway', 'loadBalancer', 'backend1', 'queue', 'workerA'],
      ['client', 'cdn', 'apiGateway', 'loadBalancer2', 'backend4', 'queue2', 'workerB'],
    ],
    spawnInterval: 130,
  },
]

const ArchitectureLinks = memo(function ArchitectureLinks({ linkGeometries, trafficPulses }) {
  const pointsByNode = useMemo(() => {
    const map = {}
    linkGeometries.forEach((link) => {
      map[link.sourceId] = { x: link.x1, y: link.y1 }
      map[link.targetId] = { x: link.x2, y: link.y2 }
    })
    return map
  }, [linkGeometries])

  const pulseDots = useMemo(
    () =>
      trafficPulses
        .map((pulse) => {
          const from = pointsByNode[pulse.route[pulse.segmentIndex]]
          const to = pointsByNode[pulse.route[pulse.segmentIndex + 1]]
          if (!from || !to) return null
          return {
            id: pulse.id,
            x: from.x + (to.x - from.x) * pulse.progress,
            y: from.y + (to.y - from.y) * pulse.progress,
          }
        })
        .filter(Boolean),
    [pointsByNode, trafficPulses]
  )

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full">
      {linkGeometries.map((link, index) => (
        <g key={link.id}>
          <line x1={link.x1} y1={link.y1} x2={link.x2} y2={link.y2} className="architecture-link" />
          {index % 2 === 0 ? <circle r="2.5" cx={link.x2} cy={link.y2} className="architecture-flow-node" /> : null}
        </g>
      ))}
      {pulseDots.map((pulse) => (
        <circle key={pulse.id} r="3" cx={pulse.x} cy={pulse.y} className="architecture-flow-pulse" />
      ))}
    </svg>
  )
})

const ArchitectureNode = memo(function ArchitectureNode({
  node,
  position,
  loadValue,
  cpuValue,
  latencyValue,
  databaseStress,
  cacheRelief,
  isVisible,
  onPointerDown,
  onMouseEnter,
  onMouseLeave,
}) {
  const Icon = node.icon
  if (!position) return null

  return (
    <div
      onPointerDown={(event) => onPointerDown(event, node.id)}
      onMouseEnter={() => onMouseEnter(node.id)}
      onMouseLeave={() => onMouseLeave(node.id)}
      className={`absolute select-none rounded-xl border border-ai-border bg-ai-surface/95 px-3.5 py-2.5 text-ai-text-primary shadow-[0_0_20px_rgba(120,220,255,0.15)] transition duration-[400ms] ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-90'
      }`}
      style={{
        width: NODE_WIDTH,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none',
        filter:
          (node.id === 'database' || node.id === 'dbPrimary') && databaseStress
            ? 'drop-shadow(0 0 10px rgba(255,86,86,0.55))'
            : loadValue > 85
              ? 'drop-shadow(0 0 10px rgba(255,86,86,0.45))'
              : loadValue > 60
                ? 'drop-shadow(0 0 8px rgba(250,204,21,0.4))'
            : (node.id === 'cache' || node.id === 'queue' || node.id === 'queue2') && cacheRelief
              ? 'drop-shadow(0 0 10px rgba(34,197,94,0.45))'
            : undefined,
      }}
    >
      <div className="flex items-center gap-2">
        <Icon className="text-accent" size={15} aria-hidden="true" />
        <span className="text-xs font-semibold">{node.label}</span>
      </div>

      <div className="mt-2">
        <div className="mb-1 text-[10px] font-medium text-ai-text-secondary">
          CPU {Math.round(cpuValue)}% · Lat {Math.round(latencyValue)}ms
        </div>
        <div className="mb-1 text-[10px] font-medium text-ai-text-secondary">Load: {Math.round(loadValue)}%</div>
        <div className="h-1 w-full overflow-hidden rounded bg-ai-card/70 dark:bg-ai-card/70">
          <div
            className="h-full rounded bg-accent transition-all duration-[400ms] ease-out"
            style={{ width: `${Math.min(100, Math.max(0, loadValue))}%` }}
          />
        </div>
      </div>

    </div>
  )
})

function TooltipPortal({ node, position }) {
  const root = typeof document !== 'undefined' ? document.getElementById('tooltip-root') : null
  if (!root || !node || !position) return null

  return createPortal(
    <div
      className="pointer-events-none fixed rounded-[10px] border border-ai-border bg-ai-surface/95 px-3 py-2 text-[11px] leading-relaxed text-ai-text-secondary shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur transition-opacity duration-150"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -110%)',
        zIndex: 9999,
        opacity: 1,
      }}
    >
      <div className="font-semibold text-ai-text-primary">{node.label}</div>
      <div className="mt-0.5 max-w-[220px]">{node.description}</div>
    </div>,
    root
  )
}

function pickLayout(width) {
  if (width < 768) return MOBILE_LAYOUT
  if (width < 1100) return TABLET_LAYOUT
  return DESKTOP_LAYOUT
}

function toPixelPosition(percentPos, width, height) {
  const x = (percentPos.x / 100) * width - NODE_WIDTH / 2
  const y = (percentPos.y / 100) * height - NODE_HEIGHT / 2
  return {
    x: Math.max(0, Math.min(width - NODE_WIDTH, x)),
    y: Math.max(0, Math.min(height - NODE_HEIGHT, y)),
  }
}

function clampNode(position, width, height) {
  return {
    x: Math.max(0, Math.min(width - NODE_WIDTH, position.x)),
    y: Math.max(0, Math.min(height - NODE_HEIGHT, position.y)),
  }
}

function distributeVertical(count, centerY, spacing, height) {
  if (count <= 1) return [Math.max(0, Math.min(height - NODE_HEIGHT, centerY - NODE_HEIGHT / 2))]
  const total = (count - 1) * spacing
  const start = centerY - total / 2
  return Array.from({ length: count }, (_, i) => {
    const y = start + i * spacing - NODE_HEIGHT / 2
    return Math.max(0, Math.min(height - NODE_HEIGHT, y))
  })
}

function buildAutoLayout(visibleNodeIds, width, height) {
  const visibleSet = new Set(visibleNodeIds)
  const layout = {}
  const minHorizontalGap = NODE_WIDTH + 16
  const minVerticalGap = NODE_HEIGHT + 8
  const safeQueueSpacing = Math.max(QUEUE_HORIZONTAL_SPACING, minHorizontalGap)
  const safeReplicaSpacing = Math.max(DB_REPLICA_SPACING, minHorizontalGap)
  const zoneX = {
    layer1: width * 0.1,
    layer2: width * 0.24,
    layer3: width * 0.36,
    layer4: width * 0.5,
    layer5: width * 0.66,
    layer6: width * 0.82,
  }

  const placeLayer = (ids, x, spacing = MIN_NODE_SPACING) => {
    const present = ids.filter((id) => visibleSet.has(id))
    const ys = distributeVertical(present.length, height * 0.5, Math.max(spacing, minVerticalGap), height)
    present.forEach((id, idx) => {
      layout[id] = clampNode({ x: x - NODE_WIDTH / 2, y: ys[idx] }, width, height)
    })
  }

  placeLayer(['client', 'cdn'], zoneX.layer1)
  placeLayer(['loadBalancer', 'loadBalancer2'], zoneX.layer2)
  placeLayer(['apiGateway'], zoneX.layer3)
  placeLayer(['auth'], zoneX.layer5)

  const backendNodes = ['backend', 'backend1', 'backend2', 'backend3', 'backend4', 'backend5', 'backend6'].filter((id) =>
    visibleSet.has(id)
  )
  const backendYs = distributeVertical(
    backendNodes.length,
    height * 0.5,
    Math.max(BACKEND_VERTICAL_SPACING, minVerticalGap),
    height
  )
  backendNodes.forEach((id, idx) => {
    layout[id] = clampNode(
      { x: zoneX.layer4 - NODE_WIDTH / 2, y: backendYs[idx] },
      width,
      height
    )
  })

  const infraCluster = ['queue', 'queue2', 'workerA', 'workerB'].filter((id) => visibleSet.has(id))
  const clusterTotalOffset = Math.max(0, (infraCluster.length - 1) * safeQueueSpacing)
  const clusterMaxStart = Math.max(0, width - NODE_WIDTH - clusterTotalOffset)
  const clusterIdealStart = zoneX.layer5 - clusterTotalOffset / 2 - NODE_WIDTH / 2
  const clusterStartX = Math.max(0, Math.min(clusterMaxStart, clusterIdealStart))
  const clusterY = Math.min(height - NODE_HEIGHT - 16, height * 0.78)
  infraCluster.forEach((id, idx) => {
    layout[id] = clampNode(
      { x: clusterStartX + idx * safeQueueSpacing, y: clusterY },
      width,
      height
    )
  })

  if (visibleSet.has('cache')) {
    layout.cache = clampNode(
      { x: zoneX.layer5 - NODE_WIDTH / 2, y: height * 0.36 - NODE_HEIGHT / 2 },
      width,
      height
    )
  }

  const primaryDb = visibleSet.has('dbPrimary') ? 'dbPrimary' : visibleSet.has('database') ? 'database' : null
  const replicas = ['dbReplica1', 'dbReplica2', 'dbReplica3', 'storage'].filter((id) => visibleSet.has(id))
  const dbGroupCount = (primaryDb ? 1 : 0) + replicas.length
  const dbTotalOffset = Math.max(0, (dbGroupCount - 1) * safeReplicaSpacing)
  const dbMaxStart = Math.max(0, width - NODE_WIDTH - dbTotalOffset)
  const dbIdealStart = zoneX.layer6 - NODE_WIDTH / 2 - dbTotalOffset * 0.35
  const dbStartX = Math.max(0, Math.min(dbMaxStart, dbIdealStart))

  if (primaryDb) {
    layout[primaryDb] = clampNode(
      { x: dbStartX, y: height * 0.5 - NODE_HEIGHT / 2 },
      width,
      height
    )
  }

  replicas.forEach((id, idx) => {
    const x = dbStartX + safeReplicaSpacing * (idx + (primaryDb ? 1 : 0))
    const y = height * 0.5 - NODE_HEIGHT / 2
    layout[id] = clampNode({ x, y }, width, height)
  })

  return layout
}

export function SystemArchitecturePlayground() {
  const containerRef = useRef(null)
  const dragRafRef = useRef(0)
  const evolutionRafRef = useRef(0)
  const scaleRafRef = useRef(0)
  const attackRafRef = useRef(0)
  const dragEventRef = useRef(null)
  const draggingRef = useRef(null)
  const nodePositionsRef = useRef({})
  const lastEvolutionSwitchRef = useRef(0)
  const pulseIdRef = useRef(0)

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [nodePositions, setNodePositions] = useState({})
  const [hoveredNode, setHoveredNode] = useState(null)
  const [evolutionEnabled, setEvolutionEnabled] = useState(false)
  const [stageIndex, setStageIndex] = useState(0)
  const [trafficPulses, setTrafficPulses] = useState([])
  const [nodeLoad, setNodeLoad] = useState({})
  const [databaseStress, setDatabaseStress] = useState(false)
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 46,
    latency: 128,
    errorRate: 0.4,
    throughput: 12000,
  })

  const [scaleMode, setScaleMode] = useState(false)
  const [scaleStageIndex, setScaleStageIndex] = useState(0)
  const [scaleDone, setScaleDone] = useState(false)
  const [attackMode, setAttackMode] = useState(false)
  const [attackStageIndex, setAttackStageIndex] = useState(0)
  const [attackDone, setAttackDone] = useState(false)
  const [attackIntensity, setAttackIntensity] = useState(1)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return undefined

    const resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (!rect) return
      setContainerSize({ width: rect.width, height: rect.height })
    })
    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [])

  const applyLayout = (layout, visibleIds = null) => {
    if (!containerSize.width || !containerSize.height) return
    const next = { ...nodePositionsRef.current }
    const autoLayout = visibleIds
      ? buildAutoLayout(visibleIds, containerSize.width, containerSize.height)
      : null

    ALL_NODES.forEach((node) => {
      const target = autoLayout?.[node.id] || (layout[node.id] ? toPixelPosition(layout[node.id], containerSize.width, containerSize.height) : null)
      if (target) {
        next[node.id] = target
      } else if (!next[node.id]) {
        next[node.id] = toPixelPosition({ x: 50, y: 50 }, containerSize.width, containerSize.height)
      }
    })
    nodePositionsRef.current = next
    setNodePositions(next)
  }

  useEffect(() => {
    if (!containerSize.width || !containerSize.height) return
    const layout = attackMode
      ? ATTACK_STAGES[attackStageIndex]?.layout || DESKTOP_LAYOUT
      : scaleMode
        ? SCALE_STAGES[scaleStageIndex]?.layout || DESKTOP_LAYOUT
        : pickLayout(containerSize.width)
    const visible = attackMode
      ? ATTACK_STAGES[attackStageIndex]?.visible
      : scaleMode
        ? SCALE_STAGES[scaleStageIndex]?.visible
        : null
    applyLayout(layout, visible || null)
  }, [attackMode, attackStageIndex, containerSize.height, containerSize.width, scaleMode, scaleStageIndex])

  useEffect(() => {
    if (!evolutionEnabled || containerSize.width < 768 || scaleMode || attackMode) return undefined

    const animateEvolution = (now) => {
      if (!lastEvolutionSwitchRef.current) lastEvolutionSwitchRef.current = now
      if (now - lastEvolutionSwitchRef.current >= EVOLUTION_STEP_MS) {
        setStageIndex((value) => (value + 1) % EVOLUTION_STAGES.length)
        lastEvolutionSwitchRef.current = now
      }
      evolutionRafRef.current = requestAnimationFrame(animateEvolution)
    }

    evolutionRafRef.current = requestAnimationFrame(animateEvolution)
    return () => {
      if (evolutionRafRef.current) cancelAnimationFrame(evolutionRafRef.current)
      lastEvolutionSwitchRef.current = 0
    }
  }, [attackMode, containerSize.width, evolutionEnabled, scaleMode])

  useEffect(() => {
    if (!evolutionEnabled || !containerSize.width || containerSize.width < 768 || scaleMode || attackMode) return
    applyLayout(EVOLUTION_STAGES[stageIndex], BASE_NODES.map((node) => node.id))
  }, [attackMode, containerSize.height, containerSize.width, evolutionEnabled, stageIndex, scaleMode])

  useEffect(() => {
    const onPointerMove = (event) => {
      dragEventRef.current = event
      if (dragRafRef.current) return
      dragRafRef.current = requestAnimationFrame(() => {
        dragRafRef.current = 0
        const drag = draggingRef.current
        const latest = dragEventRef.current
        if (!drag || !latest || !containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const nextX = latest.clientX - rect.left - drag.offsetX
        const nextY = latest.clientY - rect.top - drag.offsetY
        setNodePositions((prev) => {
          const next = {
            ...prev,
            [drag.id]: {
              x: Math.max(0, Math.min(containerSize.width - NODE_WIDTH, nextX)),
              y: Math.max(0, Math.min(containerSize.height - NODE_HEIGHT, nextY)),
            },
          }
          nodePositionsRef.current = next
          return next
        })
      })
    }

    const onPointerUp = () => {
      draggingRef.current = null
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current)
    }
  }, [containerSize.height, containerSize.width])

  useEffect(() => {
    if (!scaleMode) return undefined

    let lastSwitch = performance.now()
    const tick = (now) => {
      if (now - lastSwitch >= SCALE_STAGE_MS) {
        setScaleStageIndex((prev) => {
          const next = prev + 1
          if (next >= SCALE_STAGES.length) {
            setScaleMode(false)
            setScaleDone(true)
            return prev
          }
          return next
        })
        lastSwitch = now
      }
      if (scaleMode) {
        scaleRafRef.current = requestAnimationFrame(tick)
      }
    }

    scaleRafRef.current = requestAnimationFrame(tick)
    return () => {
      if (scaleRafRef.current) cancelAnimationFrame(scaleRafRef.current)
    }
  }, [scaleMode])

  useEffect(() => {
    if (!attackMode) return undefined

    let lastSwitch = performance.now()
    const tick = (now) => {
      if (now - lastSwitch >= SCALE_STAGE_MS) {
        setAttackStageIndex((prev) => {
          const next = prev + 1
          if (next >= ATTACK_STAGES.length) {
            setAttackMode(false)
            setAttackDone(true)
            return prev
          }
          return next
        })
        lastSwitch = now
      }
      if (attackMode) {
        attackRafRef.current = requestAnimationFrame(tick)
      }
    }

    attackRafRef.current = requestAnimationFrame(tick)
    return () => {
      if (attackRafRef.current) cancelAnimationFrame(attackRafRef.current)
    }
  }, [attackMode])

  useEffect(() => {
    if (!scaleDone && !attackDone) return undefined
    const timer = setTimeout(() => {
      setScaleDone(false)
      setAttackDone(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [attackDone, scaleDone])

  const activeScaleStage = scaleMode || scaleDone ? SCALE_STAGES[scaleStageIndex] : null
  const activeAttackStage = attackMode || attackDone ? ATTACK_STAGES[attackStageIndex] : null
  const activeScenarioStage = activeAttackStage || activeScaleStage

  const visibleNodeIds = useMemo(() => {
    if (activeScenarioStage) return new Set(activeScenarioStage.visible)
    return new Set(BASE_NODES.map((node) => node.id))
  }, [activeScenarioStage])

  const activeConnections = useMemo(() => {
    if (activeScenarioStage) return activeScenarioStage.connections
    return BASE_CONNECTIONS
  }, [activeScenarioStage])

  const centers = useMemo(() => {
    const map = {}
    ALL_NODES.forEach((node) => {
      const pos = nodePositions[node.id]
      if (!pos) return
      map[node.id] = {
        x: pos.x + NODE_WIDTH / 2,
        y: pos.y + NODE_HEIGHT / 2,
      }
    })
    return map
  }, [nodePositions])

  const linkGeometries = useMemo(
    () =>
      activeConnections
        .map(([sourceId, targetId]) => {
          const source = centers[sourceId]
          const target = centers[targetId]
          if (!source || !target) return null
          return {
            id: `${sourceId}-${targetId}`,
            sourceId,
            targetId,
            x1: source.x,
            y1: source.y,
            x2: target.x,
            y2: target.y,
          }
        })
        .filter(Boolean),
    [activeConnections, centers]
  )

  useEffect(() => {
    if (!Object.keys(centers).length) return undefined

    let rafId = 0
    let lastTick = performance.now()
    let spawnAccumulator = 0
    let nextSpikeAt = lastTick + 9000 + Math.random() * 7000
    let spikeUntil = 0

    const initialLoad = {}
    ALL_NODES.forEach((node) => {
      initialLoad[node.id] = 10
    })
    setNodeLoad(initialLoad)

    const spawnPulse = (route, speedMultiplier = 1) => {
      setTrafficPulses((prev) => [
        ...prev,
        {
          id: pulseIdRef.current++,
          route,
          segmentIndex: 0,
          progress: 0,
          speedMultiplier,
        },
      ])
    }

    const update = (now) => {
      const dt = now - lastTick
      lastTick = now

      const spiking = now < spikeUntil
      if (now > nextSpikeAt && !spiking) {
        spikeUntil = now + 3200
        nextSpikeAt = now + 9000 + Math.random() * 7000
      }

      setDatabaseStress(spiking)

      const scaleProfile = activeScenarioStage
      spawnAccumulator += dt
      const spawnInterval = scaleProfile ? scaleProfile.spawnInterval : spiking ? 520 : 1150
      const trafficIntensityLevel = Math.max(1, 1400 / spawnInterval)
      setAttackIntensity(trafficIntensityLevel)

      const routePool = scaleProfile
        ? scaleProfile.routeOptions
        : [
            ['client', 'loadBalancer', 'apiGateway', 'backend', 'database'],
            ['client', 'loadBalancer', 'apiGateway', 'backend', 'cache'],
          ]

      while (spawnAccumulator >= spawnInterval) {
        spawnAccumulator -= spawnInterval
        const route = routePool[Math.floor(Math.random() * routePool.length)]
        spawnPulse(route, (spiking ? 1.5 : 1) * Math.min(2.4, 1 + trafficIntensityLevel * 0.22))
      }

      setTrafficPulses((prevPulses) => {
        const nextPulses = []
        const loadDelta = {}

        prevPulses.forEach((pulse) => {
          const route = pulse.route
          const segmentDuration = PULSE_SEGMENT_DURATION_MS / pulse.speedMultiplier
          let progress = pulse.progress + dt / segmentDuration
          let segmentIndex = pulse.segmentIndex
          let active = true

          while (progress >= 1 && active) {
            progress -= 1
            const destination = route[segmentIndex + 1]
            if (destination) {
              loadDelta[destination] = (loadDelta[destination] || 0) + (spiking ? 15 : 8)
            }
            segmentIndex += 1
            if (segmentIndex >= route.length - 1) active = false
          }

          if (active) {
            const source = route[segmentIndex]
            const destination = route[segmentIndex + 1]
            loadDelta[source] = (loadDelta[source] || 0) + 0.9
            if (destination) loadDelta[destination] = (loadDelta[destination] || 0) + 1.4
            nextPulses.push({ ...pulse, segmentIndex, progress })
          }
        })

        setNodeLoad((prevLoad) => {
          const nextLoad = { ...prevLoad }
          ALL_NODES.forEach((node) => {
            const decayed = (nextLoad[node.id] || 10) * 0.965
            nextLoad[node.id] = Math.max(6, decayed + (loadDelta[node.id] || 0))
          })
          return nextLoad
        })

        return nextPulses
      })

      rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [activeScenarioStage, centers])

  const averageLoad = useMemo(() => {
    const visible = [...visibleNodeIds]
    if (!visible.length) return 0
    const total = visible.reduce((sum, id) => sum + (nodeLoad[id] || 0), 0)
    return total / visible.length
  }, [nodeLoad, visibleNodeIds])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const intensity = Math.max(1, attackIntensity)
      setSystemMetrics((prev) => {
        const cpu = Math.min(99, Math.max(18, prev.cpu + (Math.random() * 8 - 4) + intensity * 1.2))
        const latency = Math.min(480, Math.max(70, prev.latency + (Math.random() * 14 - 7) + intensity * 5))
        const errorRate = Math.min(8, Math.max(0.1, prev.errorRate + (Math.random() * 0.25 - 0.12) + intensity * 0.06))
        const throughput = Math.min(
          220000,
          Math.max(6000, prev.throughput + (Math.random() * 3500 - 1700) + intensity * 4200)
        )
        return { cpu, latency, errorRate, throughput }
      })
    }, 2000)

    return () => clearInterval(intervalId)
  }, [attackIntensity])

  const handlePointerDown = (event, id) => {
    const position = nodePositions[id]
    if (!position || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    draggingRef.current = {
      id,
      offsetX: event.clientX - rect.left - position.x,
      offsetY: event.clientY - rect.top - position.y,
    }
  }

  const startScaleSimulation = () => {
    setEvolutionEnabled(false)
    setAttackMode(false)
    setAttackDone(false)
    setAttackStageIndex(0)
    setStageIndex(0)
    setScaleDone(false)
    setScaleMode(true)
    setScaleStageIndex(0)
    applyLayout(SCALE_STAGES[0].layout, SCALE_STAGES[0].visible)
  }

  const startAttackSimulation = () => {
    setEvolutionEnabled(false)
    setScaleMode(false)
    setScaleDone(false)
    setScaleStageIndex(0)
    setStageIndex(0)
    setAttackDone(false)
    setAttackMode(true)
    setAttackStageIndex(0)
    applyLayout(ATTACK_STAGES[0].layout, ATTACK_STAGES[0].visible)
  }

  const tooltipPosition = useMemo(() => {
    if (!hoveredNode || !containerRef.current) return null
    const pos = nodePositions[hoveredNode]
    if (!pos) return null
    const rect = containerRef.current.getBoundingClientRect()
    return {
      x: rect.left + pos.x + NODE_WIDTH / 2,
      y: rect.top + pos.y - 10,
    }
  }, [hoveredNode, nodePositions])

  const hoveredNodeData = hoveredNode ? NODE_MAP[hoveredNode] : null
  const systemStatus =
    attackMode || averageLoad > 78 ? 'High Load' : averageLoad > 60 ? 'Stabilizing' : 'Healthy'

  return (
    <section
      id="architecture-playground"
      className="flex min-h-screen snap-start items-center bg-ai-navy px-4 py-24 dark:bg-ai-navy"
      aria-label="System Architecture Playground"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <Reveal>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">
              Interactive Architecture
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ai-text-primary sm:text-3xl dark:text-ai-text-primary">
              System Architecture Playground
            </h2>
            <p className="max-w-2xl text-sm text-ai-text-secondary dark:text-ai-text-secondary">
              Drag components to design a scalable backend architecture.
            </p>
            <p className="mt-2 max-w-3xl text-xs text-ai-text-secondary/90 dark:text-ai-text-secondary">
              Designing backend systems is similar to chess strategy — every component must work
              together to control the board.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setEvolutionEnabled((value) => !value)
                setStageIndex(0)
              }}
              disabled={scaleMode || attackMode}
              className="rounded-full border border-ai-border bg-ai-card/70 px-4 py-2 text-xs font-medium text-ai-text-secondary transition hover:border-accent hover:text-accent dark:border-ai-border dark:bg-ai-card/70 dark:text-ai-text-secondary"
            >
              {evolutionEnabled ? 'Stop Architecture Evolution' : 'Show Architecture Evolution'}
            </button>
            <button
              type="button"
              onClick={startScaleSimulation}
              disabled={scaleMode || attackMode}
              className="rounded-full border border-ai-border bg-ai-card/70 px-4 py-2 text-xs font-medium text-ai-text-secondary transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60 dark:border-ai-border dark:bg-ai-card/70 dark:text-ai-text-secondary"
            >
              Scale to 1M Users
            </button>
            <button
              type="button"
              onClick={startAttackSimulation}
              disabled={attackMode || scaleMode}
              className="rounded-full border border-ai-border bg-ai-card/70 px-4 py-2 text-xs font-medium text-ai-text-secondary transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60 dark:border-ai-border dark:bg-ai-card/70 dark:text-ai-text-secondary"
            >
              Traffic Attack Simulator
            </button>
          </div>
        </Reveal>

        <Reveal>
          <div>
            <div className="mb-3 text-sm font-semibold text-ai-text-primary">System Health Monitor</div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-xl border border-ai-border bg-ai-surface/95 px-3 py-2 shadow-[0_0_20px_rgba(120,220,255,0.15)]">
                <div className="text-[11px] text-ai-text-secondary">CPU Usage</div>
                <div className="text-lg font-semibold text-ai-text-primary">{Math.round(systemMetrics.cpu)}%</div>
              </div>
              <div className="rounded-xl border border-ai-border bg-ai-surface/95 px-3 py-2 shadow-[0_0_20px_rgba(120,220,255,0.15)]">
                <div className="text-[11px] text-ai-text-secondary">Request Latency</div>
                <div className="text-lg font-semibold text-ai-text-primary">{Math.round(systemMetrics.latency)}ms</div>
              </div>
              <div className="rounded-xl border border-ai-border bg-ai-surface/95 px-3 py-2 shadow-[0_0_20px_rgba(120,220,255,0.15)]">
                <div className="text-[11px] text-ai-text-secondary">Error Rate</div>
                <div className="text-lg font-semibold text-ai-text-primary">{systemMetrics.errorRate.toFixed(1)}%</div>
              </div>
              <div className="rounded-xl border border-ai-border bg-ai-surface/95 px-3 py-2 shadow-[0_0_20px_rgba(120,220,255,0.15)]">
                <div className="text-[11px] text-ai-text-secondary">Throughput</div>
                <div className="text-lg font-semibold text-ai-text-primary">
                  {Math.round(systemMetrics.throughput / 1000)}k req/sec
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div
            ref={containerRef}
            className="relative mx-auto h-[560px] w-full max-w-[1080px] overflow-visible rounded-2xl border border-ai-border bg-ai-card/35"
          >
            <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-full border border-ai-border bg-ai-surface/90 px-3 py-1 text-[11px] font-medium text-ai-text-secondary backdrop-blur">
              System Status: {systemStatus}
            </div>
            <ArchitectureLinks linkGeometries={linkGeometries} trafficPulses={trafficPulses} />

            {ALL_NODES.map((node) => {
              const position = nodePositions[node.id]
              return (
                <ArchitectureNode
                  key={node.id}
                  node={node}
                  position={position}
                  loadValue={nodeLoad[node.id] ?? 0}
                  cpuValue={Math.max(10, Math.min(98, (nodeLoad[node.id] ?? 0) * 0.82))}
                  latencyValue={Math.max(40, 60 + (nodeLoad[node.id] ?? 0) * 2.3)}
                  databaseStress={databaseStress}
                  cacheRelief={attackMode || (activeScenarioStage && activeScenarioStage.label === '10m')}
                  isVisible={visibleNodeIds.has(node.id)}
                  onPointerDown={handlePointerDown}
                  onMouseEnter={setHoveredNode}
                  onMouseLeave={(id) => setHoveredNode((value) => (value === id ? null : value))}
                />
              )
            })}

            {scaleDone ? (
              <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-ai-border bg-ai-surface/90 px-4 py-1.5 text-xs font-medium text-ai-text-secondary shadow-[0_0_16px_rgba(120,220,255,0.2)] backdrop-blur">
                System ready for 1M users.
              </div>
            ) : null}
            {attackDone ? (
              <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-ai-border bg-ai-surface/90 px-4 py-1.5 text-xs font-medium text-ai-text-secondary shadow-[0_0_16px_rgba(120,220,255,0.2)] backdrop-blur">
                System auto-scaled successfully.
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
      <TooltipPortal node={hoveredNodeData} position={tooltipPosition} />
    </section>
  )
}
