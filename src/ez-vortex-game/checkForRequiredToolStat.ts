import path from 'path'

import { fs, log, util } from 'vortex-api'
import type {
  IExtensionContext,
  IDiscoveryResult,
} from 'vortex-api/lib/types/api'

async function checkForRequiredToolStat(args: {
  context: IExtensionContext
  discovery: IDiscoveryResult
  paths: string[]
  name: string
  message?: string
  url: string
}) {
  const found: string[] = []

  if (!args.discovery.path) {
    throw new Error('No path for game')
  }

  for (const toolPath of args.paths) {
    const finalPath = path.join(args.discovery.path, toolPath)
    try {
      await fs.statAsync(finalPath)
      found.push(finalPath)
    } catch (err: any) {
      log('error', err.message, { stack: err.stack })
    }
  }

  if (found.length === 0) {
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

    return false
  }

  return true
}

export default checkForRequiredToolStat
