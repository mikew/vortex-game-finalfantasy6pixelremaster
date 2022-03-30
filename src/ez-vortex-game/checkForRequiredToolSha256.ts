import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

import { log, util } from 'vortex-api'
import { IExtensionContext, IDiscoveryResult } from 'vortex-api/lib/types/api'

async function checkForRequiredToolSha256(args: {
  context: IExtensionContext
  discovery: IDiscoveryResult
  path: string
  hashes: string[]
  name: string
  message?: string
  url: string
}) {
  if (!args.discovery.path) {
    throw new Error('No path for game')
  }

  function sendNotification() {
    args.context.api.sendNotification?.({
      id: `${args.name}-miissing`,
      type: 'warning',
      title: `${args.name} not installed`,
      message: args.message ?? `${args.name} is recommended for most mods`,
      actions: [
        {
          title: `Get ${args.name}`,
          action: () => util.opn(args.url),
        },
      ],
    })
  }

  try {
    const fullPath = path.join(args.discovery.path, args.path)

    if (!fs.existsSync(fullPath)) {
      throw new Error(`${fullPath} not found`)
    }

    const hash = await getFileHash(fullPath, 'sha256')
    log('debug', `${args.path} sha256: ${hash}`)

    if (!args.hashes.map((x) => x.toLowerCase()).includes(hash)) {
      throw new Error(
        `${fullPath} sha256 doesn't match ${args.hashes.join(', ')}`,
      )
    }
  } catch (err) {
    sendNotification()
    return false
  }

  return true
}

function getFileHash(file: string, algorithm: string) {
  return new Promise<string>((resolve, reject) => {
    const hash = crypto.createHash(algorithm)

    try {
      const stream = fs.createReadStream(file)

      stream.on('data', (data) => {
        hash.update(data)
      })

      stream.on('error', (err) => {
        reject(err)
      })

      stream.on('end', () => {
        resolve(hash.digest('hex'))
      })
    } catch (err) {
      reject(err)
    }
  })
}

export default checkForRequiredToolSha256
