import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaDatabase } from 'react-icons/fa'
import { FaHardDrive, FaLock, FaServer, FaExpand, FaCompress } from 'react-icons/fa6'
import { SiApachekafka, SiPostgresql, SiRedis, SiSpringboot } from 'react-icons/si'
import { Reveal } from '../components/ui/Reveal'

const NODE_WIDTH = 158
const NODE_HEIGHT = 62
const EVOLUTION_STEP_MS = 3800
const PULSE_SEGMENT_DURATION_MS = 2000
const SCALE_STAGE_MS = 2000
const MIN_NODE_SPACING = 180
const LAYER_SPACING = 180
const BACKEND_VERTICAL_SPACING = 80
const WORKER_HORIZONTAL_SPACING = 140
const QUEUE_HORIZONTAL_SPACING = 140
const DB_REPLICA_SPACING = 160
const MIN_CANVAS_WIDTH = 1400

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

const FAILURE_STAGES = [
  {
    // Stage 1: DB Primary Fails
    label: 'db-failure',
    crashedNodes: ['dbPrimary'],
    visible: ['client', 'apiGateway', 'loadBalancer', 'backend1', 'backend2', 'backend3', 'cache', 'dbPrimary', 'dbReplica1', 'dbReplica2'],
    connections: [
      ['client', 'apiGateway'],
      ['apiGateway', 'loadBalancer'],
      ['loadBalancer', 'backend1'],
      ['loadBalancer', 'backend2'],
      ['loadBalancer', 'backend3'],
      ['backend1', 'cache'],
      ['backend2', 'cache'],
      ['backend3', 'cache'],
      ['backend1', 'dbReplica1'],
      ['backend2', 'dbReplica2'],
      ['backend3', 'dbReplica1'],
    ],
    routeOptions: [
      ['client', 'apiGateway', 'loadBalancer', 'backend1', 'cache'],
      ['client', 'apiGateway', 'loadBalancer', 'backend2', 'cache'],
      ['client', 'apiGateway', 'loadBalancer', 'backend3', 'cache'],
      ['client', 'apiGateway', 'loadBalancer', 'backend1', 'dbReplica1'],
      ['client', 'apiGateway', 'loadBalancer', 'backend2', 'dbReplica2'],
      ['client', 'apiGateway', 'loadBalancer', 'backend3', 'dbReplica1'],
    ],
    spawnInterval: 500,
  },
  {
    // Stage 2: Cache Also Fails
    label: 'cache-failure',
    crashedNodes: ['dbPrimary', 'cache'],
    visible: ['client', 'apiGateway', 'loadBalancer', 'backend1', 'backend2', 'backend3', 'cache', 'dbPrimary', 'dbReplica1', 'dbReplica2'],
    connections: [
      ['client', 'apiGateway'],
      ['apiGateway', 'loadBalancer'],
      ['loadBalancer', 'backend1'],
      ['loadBalancer', 'backend2'],
      ['loadBalancer', 'backend3'],
      ['backend1', 'dbReplica1'],
      ['backend2', 'dbReplica2'],
      ['backend3', 'dbReplica1'],
    ],
    routeOptions: [
      ['client', 'apiGateway', 'loadBalancer', 'backend1', 'dbReplica1'],
      ['client', 'apiGateway', 'loadBalancer', 'backend2', 'dbReplica2'],
      ['client', 'apiGateway', 'loadBalancer', 'backend3', 'dbReplica1'],
    ],
    spawnInterval: 700,
  },
  {
    // Stage 3: Backend Instance 1 Fails
    label: 'backend-failure',
    crashedNodes: ['dbPrimary', 'cache', 'backend1'],
    visible: ['client', 'apiGateway', 'loadBalancer', 'backend1', 'backend2', 'backend3', 'cache', 'dbPrimary', 'dbReplica1', 'dbReplica2'],
    connections: [
      ['client', 'apiGateway'],
      ['apiGateway', 'loadBalancer'],
      ['loadBalancer', 'backend2'],
      ['loadBalancer', 'backend3'],
      ['backend2', 'dbReplica2'],
      ['backend3', 'dbReplica1'],
    ],
    routeOptions: [
      ['client', 'apiGateway', 'loadBalancer', 'backend2', 'dbReplica2'],
      ['client', 'apiGateway', 'loadBalancer', 'backend3', 'dbReplica1'],
    ],
    spawnInterval: 400,
  },
  {
    // Stage 4: Recovering
    label: 'recovering',
    crashedNodes: [],
    visible: ['client', 'apiGateway', 'loadBalancer', 'backend1', 'backend2', 'backend3', 'cache', 'dbPrimary', 'dbReplica1', 'dbReplica2'],
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
    routeOptions: [
      ['client', 'apiGateway', 'loadBalancer', 'backend1', 'cache'],
      ['client', 'apiGateway', 'loadBalancer', 'backend2', 'cache'],
      ['client', 'apiGateway', 'loadBalancer', 'backend3', 'cache'],
      ['client', 'apiGateway', 'loadBalancer', 'backend3', 'dbPrimary'],
      ['client', 'apiGateway', 'loadBalancer', 'backend1', 'dbReplica1'],
      ['client', 'apiGateway', 'loadBalancer', 'backend2', 'dbReplica2'],
    ],
    spawnInterval: 400,
  }
]

function getBezierPath(x1, y1, x2, y2) {
  // Add organic curve based on distance
  const distance = Math.abs(x2 - x1)
  const magic = Math.max(distance * 0.4, 60)
  return `M ${x1} ${y1} C ${x1 + magic} ${y1}, ${x2 - magic} ${y2}, ${x2} ${y2}`
}

function getPointOnBezier(p0, p1, p2, p3, t) {
  const mt = 1 - t
  const mt2 = mt * mt
  const mt3 = mt2 * mt
  const t2 = t * t
  const t3 = t2 * t
  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
  }
}

const ArchitectureLinks = memo(function ArchitectureLinks({ linkGeometries, trafficPulses }) {
  const pointsByNode = useMemo(() => {
    const map = {}
    linkGeometries.forEach((link) => {
      map[link.sourceId] = { x: link.x1, y: link.y1 }
      map[link.targetId] = { x: link.x2, y: link.y2 }
    })
    return map
  }, [linkGeometries])

  const pulseDots = useMemo(() => {
    return trafficPulses
      .map((pulse) => {
        const from = pointsByNode[pulse.route[pulse.segmentIndex]]
        const to = pointsByNode[pulse.route[pulse.segmentIndex + 1]]
        if (!from || !to) return null

        const distance = Math.abs(to.x - from.x)
        const magic = Math.max(distance * 0.4, 60)
        
        const p0 = { x: from.x, y: from.y }
        const p1 = { x: from.x + magic, y: from.y }
        const p2 = { x: to.x - magic, y: to.y }
        const p3 = { x: to.x, y: to.y }

        const pt = getPointOnBezier(p0, p1, p2, p3, pulse.progress)

        return {
          id: pulse.id,
          x: pt.x,
          y: pt.y,
        }
      })
      .filter(Boolean)
  }, [pointsByNode, trafficPulses])

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      {linkGeometries.map((link, index) => {
        const pathData = getBezierPath(link.x1, link.y1, link.x2, link.y2)
        return (
          <g key={link.id}>
            <path
              d={pathData}
              fill="none"
              stroke="rgba(120, 220, 255, 0.15)"
              strokeWidth="1.5"
              className="transition-all duration-400 ease-out"
            />
            {index % 2 === 0 ? <circle r="2.5" cx={link.x2} cy={link.y2} className="architecture-flow-node" /> : null}
          </g>
        )
      })}
      {pulseDots.map((pulse) => (
        <circle key={pulse.id} r="3" cx={pulse.x} cy={pulse.y} fill="#78dcff" className="shadow-[0_0_10px_#78dcff]" />
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
  isCrashed = false,
  onPointerDown,
  onMouseEnter,
  onMouseLeave,
}) {
  const Icon = node.icon
  if (!position) return null
  
  const nodeGlowStyle = isCrashed 
      ? 'shadow-[0_0_20px_rgba(255,86,86,0.55)] border-red-500/80 bg-red-950/40 text-ai-text-primary' 
      : 'shadow-[0_0_20px_rgba(120,220,255,0.15)] border-ai-border bg-ai-surface/95 text-ai-text-primary'

  return (
    <div
      onPointerDown={(event) => onPointerDown(event, node.id)}
      onMouseEnter={() => onMouseEnter(node.id)}
      onMouseLeave={() => onMouseLeave(node.id)}
      className={`absolute select-none rounded-xl border px-3.5 py-2.5 transition duration-[400ms] ease-out ${nodeGlowStyle} ${
        isVisible ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-90'
      }`}
      style={{
        width: NODE_WIDTH,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none',
        filter:
          !isCrashed && (node.id === 'database' || node.id === 'dbPrimary') && databaseStress
            ? 'drop-shadow(0 0 10px rgba(255,86,86,0.55))'
            : !isCrashed && loadValue > 85
              ? 'drop-shadow(0 0 10px rgba(255,86,86,0.45))'
              : !isCrashed && loadValue > 60
                ? 'drop-shadow(0 0 8px rgba(250,204,21,0.4))'
            : !isCrashed && (node.id === 'cache' || node.id === 'queue' || node.id === 'queue2') && cacheRelief
              ? 'drop-shadow(0 0 10px rgba(34,197,94,0.45))'
            : undefined,
      }}
    >
      <div className="flex items-center gap-2">
         {isCrashed ? (
             <div className="relative h-4 w-4 text-red-500 opacity-90">
               <span className="absolute inline-flex h-full w-full animate-[ping_2s_ease-in-out_infinite] rounded-full bg-red-500 opacity-75"></span>
               <Icon className="relative" size={15} />
             </div>
          ) : (
            <Icon className="text-accent" size={15} aria-hidden="true" />
          )}
        <span className={`text-xs font-semibold ${isCrashed ? 'text-red-400' : ''}`}>{node.label}</span>
      </div>

      <div className="mt-2 text-left">
        <div className="mb-1 text-[10px] font-medium text-ai-text-secondary">
          {isCrashed ? 'ERR' : `CPU ${Math.round(cpuValue)}%`} · {isCrashed ? 'TIMEOUT' : `Lat ${Math.round(latencyValue)}ms`}
        </div>
        <div className="mb-1 text-[10px] font-medium text-ai-text-secondary">Load: {isCrashed ? 0 : Math.round(loadValue)}%</div>
        <div className="h-1 w-full overflow-hidden rounded bg-ai-card/70 dark:bg-ai-card/70">
          <div
            className={`h-full rounded transition-all duration-[400ms] ease-out ${isCrashed ? 'bg-red-500' : 'bg-accent'}`}
            style={{ width: `${isCrashed ? 0 : Math.min(100, Math.max(0, loadValue))}%` }}
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

function calculateDynamicLayout(visibleNodeIds, containerWidth, containerHeight) {
  const visibleSet = new Set(visibleNodeIds)
  const layout = {}

  // Minimum architecture width (scrolls horizontally if needed)
  const effectiveWidth = Math.max(containerWidth, MIN_CANVAS_WIDTH)
  const startX = 60

  // Standard architectural layers mapping mapping (nodes must strictly follow layers)
  const layers = {
    L1: ['client'],
    L2: ['cdn'],
    L3: ['loadBalancer', 'loadBalancer2'],
    L4: ['apiGateway'],
    L5: ['backend', 'backend1', 'backend2', 'backend3', 'backend4', 'backend5', 'backend6', 'auth'],
    L6: ['cache', 'queue', 'queue2'],
    L7: ['workerA', 'workerB'],
    L8: ['database', 'dbPrimary', 'dbReplica1', 'dbReplica2', 'dbReplica3', 'storage'],
  }

  // Determine which layers are active
  const activeLayers = {}
  Object.entries(layers).forEach(([layerKey, identifiers]) => {
    activeLayers[layerKey] = identifiers.filter((id) => visibleSet.has(id))
  })

  // -------------------------------------------------------------
  // Calculate X offsets (1 column per layer, min 180px gap)
  // -------------------------------------------------------------
  const layerX = {}
  let currentX = startX

  const layerList = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8']
  layerList.forEach((key) => {
    if (activeLayers[key].length > 0) {
      layerX[key] = currentX
      currentX += LAYER_SPACING + NODE_WIDTH
    }
  })

  // Total required canvas width is currentX. If our container is larger, we can center it.
  const totalGraphWidth = currentX
  const shiftX = Math.max(0, (effectiveWidth - totalGraphWidth) / 2)

  layerList.forEach((key) => {
    if (layerX[key] !== undefined) {
      layerX[key] += shiftX
    }
  })

  // -------------------------------------------------------------
  // PLACEMENT LOGIC
  // -------------------------------------------------------------
  
  // Layer 1 (Client)
  if (activeLayers.L1.length) {
    layout[activeLayers.L1[0]] = { x: layerX.L1, y: containerHeight / 2 - NODE_HEIGHT / 2 }
  }

  // Layer 2 (CDN)
  if (activeLayers.L2.length) {
    layout[activeLayers.L2[0]] = { x: layerX.L2, y: containerHeight / 2 - NODE_HEIGHT / 2 }
  }

  // Layer 3 (Load Balancers - Usually 1 or 2 vertical stack)
  if (activeLayers.L3.length) {
    const list = activeLayers.L3
    const ys = distributeVertical(list.length, containerHeight / 2, Math.max(120, NODE_HEIGHT + 20), containerHeight)
    list.forEach((id, idx) => {
      layout[id] = { x: layerX.L3, y: ys[idx] }
    })
  }

  // Layer 4 (API Gateway)
  if (activeLayers.L4.length) {
    layout[activeLayers.L4[0]] = { x: layerX.L4, y: containerHeight / 2 - NODE_HEIGHT / 2 }
  }

  // Layer 5 (Backend Stack - Vertical)
  if (activeLayers.L5.length) {
    const backendNodes = activeLayers.L5.filter(id => id !== 'auth')
    const ys = distributeVertical(
      backendNodes.length,
      containerHeight / 2,
      BACKEND_VERTICAL_SPACING,
      containerHeight
    )
    backendNodes.forEach((id, idx) => {
      layout[id] = { x: layerX.L5, y: ys[idx] }
    })
    
    // Auth node sits separately
    if (visibleSet.has('auth')) {
       layout['auth'] = { x: layerX.L5, y: containerHeight * 0.15 }
    }
  }

  // Layer 6 (Cache & Message Queues - Vertical Stack)
  if (activeLayers.L6.length) {
    const cacheIndex = activeLayers.L6.indexOf('cache')
    const queues = activeLayers.L6.filter(id => id.startsWith('queue'))

    if (cacheIndex !== -1) {
       // Cache usually sits higher up
       layout['cache'] = { x: layerX.L6, y: containerHeight / 3 - NODE_HEIGHT / 2 }
    }
    
    // Distribute Queues lower
    if(queues.length) {
       const qsYs = distributeVertical(queues.length, containerHeight * 0.65, QUEUE_HORIZONTAL_SPACING, containerHeight)
       queues.forEach((id, idx) => {
          layout[id] = { x: layerX.L6, y: qsYs[idx] }
       })
    }
  }

  // Layer 7 (Workers - Horizontal stack, but we stick them horizontally due to layer layout logic)
  if (activeLayers.L7.length) {
    const workers = activeLayers.L7
    const workerY = containerHeight * 0.78
    
    workers.forEach((id, idx) => {
      layout[id] = { x: layerX.L7 + (idx * WORKER_HORIZONTAL_SPACING * 0.6), y: workerY + (idx % 2 === 0 ? 0 : 40) }
    })
  }

  // Layer 8 (Databases - Horizontal Spread)
  if (activeLayers.L8.length) {
    const dbs = activeLayers.L8.filter(id => id !== 'storage')
    const storageNode = activeLayers.L8.find(id => id === 'storage')
    
    // Primary DB is centered if exists
    const primaryDb = visibleSet.has('dbPrimary') ? 'dbPrimary' : visibleSet.has('database') ? 'database' : null
    const replicas = dbs.filter(id => id !== primaryDb)

    const dbBaseY = containerHeight / 2 - NODE_HEIGHT / 2
    
    if (primaryDb) {
      layout[primaryDb] = { x: layerX.L8, y: dbBaseY }
    }

    replicas.forEach((id, idx) => {
      layout[id] = { x: layerX.L8 + DB_REPLICA_SPACING * (idx + (primaryDb ? 1 : 0)*0.7), y: dbBaseY + (idx*40) } // Slight waterfall layout
    })

    if (storageNode) {
       layout[storageNode] = { x: layerX.L8, y: containerHeight * 0.8 }
    }
  }

  // Clamp everything strictly so it does NOT overflow vertically at any point
  Object.keys(layout).forEach(nodeId => {
     layout[nodeId] = clampNode(layout[nodeId], 4000, containerHeight)
  })

  return { layout, virtualWidth: totalGraphWidth }
}

export function SystemArchitecturePlayground() {
  const containerRef = useRef(null)
  const dragRafRef = useRef(0)
  const evolutionRafRef = useRef(0)
  const scaleRafRef = useRef(0)
  const attackRafRef = useRef(0)
  const dragEventRef = useRef(null)
  const draggingRef = useRef(null)
  const canvasDragRef = useRef(null)
  const nodePositionsRef = useRef({})
  const lastEvolutionSwitchRef = useRef(0)
  const pulseIdRef = useRef(0)

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [nodePositions, setNodePositions] = useState({})
  const [hoveredNode, setHoveredNode] = useState(null)
  const [evolutionEnabled, setEvolutionEnabled] = useState(false)
  
  // Canvas State: Pan & Zoom
  const [panZoom, setPanZoom] = useState({ x: 0, y: 0, scale: 1 })
  const [isPanning, setIsPanning] = useState(false)
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
  
  // Feature: Chaos Monkey & Fullscreen
  const [failureMode, setFailureMode] = useState(false)
  const [failureStageIndex, setFailureStageIndex] = useState(0)
  const [failureDone, setFailureDone] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState(null)

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
    const dynamicResult = visibleIds
      ? calculateDynamicLayout(visibleIds, containerSize.width, containerSize.height)
      : null
    const autoLayout = dynamicResult ? dynamicResult.layout : null

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
    if (!failureMode) return undefined

    let lastSwitch = performance.now()
    const tick = (now) => {
      const waitTime = failureStageIndex === FAILURE_STAGES.length - 1 ? 3000 : 2000
      if (now - lastSwitch >= waitTime) {
        setFailureStageIndex((prev) => {
          const next = prev + 1
          if (next >= FAILURE_STAGES.length) {
            setFailureMode(false)
            setFailureDone(true)
            return prev
          }
          return next
        })
        lastSwitch = now
      }
      if (failureMode) {
        requestAnimationFrame(tick)
      }
    }

    const rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [failureMode, failureStageIndex])

  useEffect(() => {
    if (!scaleDone && !attackDone && !failureDone) return undefined
    const timer = setTimeout(() => {
      setScaleDone(false)
      setAttackDone(false)
      setFailureDone(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [attackDone, scaleDone, failureDone])

  const activeScaleStage = scaleMode || scaleDone ? SCALE_STAGES[scaleStageIndex] : null
  const activeAttackStage = attackMode || attackDone ? ATTACK_STAGES[attackStageIndex] : null
  const activeFailureStage = failureMode || failureDone ? FAILURE_STAGES[failureStageIndex] : null
  const activeScenarioStage = activeFailureStage || activeAttackStage || activeScaleStage

  const visibleNodeIds = useMemo(() => {
    if (activeScenarioStage) return new Set(activeScenarioStage.visible)
    return new Set(BASE_NODES.map((node) => node.id))
  }, [activeScenarioStage])

  const activeConnections = useMemo(() => {
    if (activeScenarioStage) return activeScenarioStage.connections
    return BASE_CONNECTIONS
  }, [activeScenarioStage])

  const crashedNodesSet = useMemo(() => {
    if (activeFailureStage) return new Set(activeFailureStage.crashedNodes || [])
    return new Set()
  }, [activeFailureStage])

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
      if (now > nextSpikeAt && !spiking && !failureMode) {
        spikeUntil = now + 3200
        nextSpikeAt = now + 9000 + Math.random() * 7000
      }

      setDatabaseStress(spiking || (activeFailureStage && activeFailureStage.label !== 'recovering'))

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
    // Only capture node drag events when the mouse targets the actual node
    const position = nodePositions[id]
    if (!position || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    
    // Convert absolute screen clientX/clientY down to the correct transformed coordinate space
    const { x: px, y: py, scale } = panZoom
    
    draggingRef.current = {
      id,
      offsetX: (event.clientX - rect.left - px) / scale - position.x,
      offsetY: (event.clientY - rect.top - py) / scale - position.y,
    }
    
    // Prevent the canvas pan listener from firing
    event.stopPropagation()
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
    setFailureMode(false)
    setFailureDone(false)
    setAttackDone(false)
    setAttackMode(true)
    setAttackStageIndex(0)
    applyLayout(ATTACK_STAGES[0].layout, ATTACK_STAGES[0].visible)
  }

  const startFailureSimulation = () => {
    setEvolutionEnabled(false)
    setScaleMode(false)
    setScaleDone(false)
    setScaleStageIndex(0)
    setStageIndex(0)
    setAttackDone(false)
    setAttackMode(false)
    setFailureDone(false)
    setFailureMode(true)
    setFailureStageIndex(0)
    applyLayout(FAILURE_STAGES[0].layout, FAILURE_STAGES[0].visible)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  useEffect(() => {
    if (!hoveredNode) {
      setTooltipPosition(null)
      return
    }

    const pos = nodePositions[hoveredNode]
    const container = containerRef.current
    if (!pos || !container) {
      setTooltipPosition(null)
      return
    }

    const updateTooltipPosition = () => {
      const rect = container.getBoundingClientRect()
      setTooltipPosition({
        x: rect.left + pos.x + NODE_WIDTH / 2,
        y: rect.top + pos.y - 10,
      })
    }

    updateTooltipPosition()
    window.addEventListener('scroll', updateTooltipPosition, true)
    window.addEventListener('resize', updateTooltipPosition)

    return () => {
      window.removeEventListener('scroll', updateTooltipPosition, true)
      window.removeEventListener('resize', updateTooltipPosition)
    }
  }, [hoveredNode, nodePositions])

  const hoveredNodeData = hoveredNode ? NODE_MAP[hoveredNode] : null
  const systemStatus = failureMode 
    ? (failureStageIndex === FAILURE_STAGES.length - 1 ? 'Recovering' : 'Failure Detected')
    : attackMode || averageLoad > 78 
      ? 'High Load' 
      : averageLoad > 60 
        ? 'Stabilizing' 
        : 'Healthy'

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
              disabled={attackMode || scaleMode || failureMode}
              className="rounded-full border border-ai-border bg-ai-card/70 px-4 py-2 text-xs font-medium text-ai-text-secondary transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60 dark:border-ai-border dark:bg-ai-card/70 dark:text-ai-text-secondary"
            >
              Traffic Attack Simulator
            </button>
            <button
              type="button"
              onClick={startFailureSimulation}
              disabled={attackMode || scaleMode || failureMode}
              className="rounded-full border border-ai-border bg-ai-card/70 px-4 py-2 text-xs font-medium text-ai-text-secondary transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60 dark:border-ai-border dark:bg-ai-card/70 dark:text-ai-text-secondary"
            >
              Failure Injection Mode
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
            className="w-full pb-8 select-none"
            onWheel={(e) => {
              // Zoom logic (Ctrl+Scroll or standard wheel depending on trackpad)
              // Only prevent scrolling if over canvas (to avoid page lock when scrolling down outside)
              if (containerRef.current && containerRef.current.contains(e.target)) {
                 e.preventDefault()
                 const zoomSensitivity = 0.002
                 const delta = -e.deltaY * zoomSensitivity
                 
                 setPanZoom(prev => {
                   const newScale = Math.min(1.6, Math.max(0.6, prev.scale * (1 + delta)))
                   
                   // Calculate zoom origin relative to the container instead of screen
                   const rect = containerRef.current.getBoundingClientRect()
                   const mouseX = e.clientX - rect.left
                   const mouseY = e.clientY - rect.top

                   // Adjust pan so the zoom is centered on the cursor
                   const newX = mouseX - (mouseX - prev.x) * (newScale / prev.scale)
                   const newY = mouseY - (mouseY - prev.y) * (newScale / prev.scale)

                   return { x: newX, y: newY, scale: newScale }
                 })
              }
            }}
            onPointerDown={(e) => {
              if (e.target.closest('.architecture-node-card')) return // Ignores nodes
              setIsPanning(true)
              canvasDragRef.current = { startX: e.clientX, startY: e.clientY, initPanX: panZoom.x, initPanY: panZoom.y }
            }}
            onPointerMove={(e) => {
               if (isPanning && canvasDragRef.current) {
                 const dx = e.clientX - canvasDragRef.current.startX
                 const dy = e.clientY - canvasDragRef.current.startY
                 setPanZoom(prev => ({
                   ...prev,
                   x: canvasDragRef.current.initPanX + dx,
                   y: canvasDragRef.current.initPanY + dy
                 }))
               }
            }}
            onPointerUp={() => setIsPanning(false)}
            onPointerLeave={() => setIsPanning(false)}
            onDoubleClick={() => setPanZoom({ x: 0, y: 0, scale: 1 })}
          >
            <div
              ref={containerRef}
              className={`relative mx-auto h-[700px] w-full max-w-[2200px] overflow-hidden rounded-2xl border border-ai-border bg-ai-card/35 transition-all duration-700 ease-in-out ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ touchAction: 'none' }}
            >
              <div className="pointer-events-none absolute left-3 top-3 z-20 w-fit rounded-full border border-ai-border bg-ai-surface/90 px-3 py-1 text-[11px] font-medium text-ai-text-secondary backdrop-blur">
                System Status: {systemStatus}
              </div>
              
              <div 
                className="absolute inset-0 origin-top-left"
                style={{
                  transform: `translate3d(${panZoom.x}px, ${panZoom.y}px, 0) scale(${panZoom.scale})`,
                  willChange: 'transform'
                }}
              >
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
                      isCrashed={crashedNodesSet.has(node.id)}
                      onPointerDown={handlePointerDown}
                      onMouseEnter={setHoveredNode}
                      onMouseLeave={(id) => setHoveredNode((value) => (value === id ? null : value))}
                    />
                  )
                })}
              </div>

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
            
            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className="absolute bottom-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-ai-border bg-ai-surface/90 text-ai-text-secondary shadow-[0_0_15px_rgba(120,220,255,0.08)] backdrop-blur transition-all hover:bg-ai-card hover:text-ai-text-primary hover:shadow-[0_0_20px_rgba(120,220,255,0.2)] active:scale-95"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
               {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
            </button>
          </div>
        </div>
        </Reveal>
      </div>
      <TooltipPortal node={hoveredNodeData} position={tooltipPosition} />
    </section>
  )
}
