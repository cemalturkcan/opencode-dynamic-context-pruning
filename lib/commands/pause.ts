/**
 * DCP Pause/Resume command handler.
 * Allows pausing and resuming all DCP processing mid-session.
 *
 * Usage:
 *   /dcp pause   - Pause all DCP hooks (pruning, nudges, system prompt, message IDs)
 *   /dcp resume  - Resume DCP processing
 */

import type { Logger } from "../logger"
import type { SessionState, WithParts } from "../state"
import type { PluginConfig } from "../config"

const DCP_PAUSED_MSG =
    "DCP is now PAUSED. All hooks are disabled until you run /dcp resume."

const DCP_RESUMED_MSG =
    "DCP is now RESUMED. All hooks are active again."

const DCP_ALREADY_PAUSED_MSG =
    "DCP is already paused. Use /dcp resume to re-enable."

const DCP_ALREADY_ACTIVE_MSG =
    "DCP is already active. Use /dcp pause to pause."

export interface PauseCommandContext {
    client: any
    state: SessionState
    config: PluginConfig
    logger: Logger
    sessionId: string
    messages: WithParts[]
}

export async function handlePauseCommand(ctx: PauseCommandContext): Promise<void> {
    const { client, state, logger } = ctx

    if (state.paused) {
        try { await client.tui.showToast({ body: { title: "DCP", message: DCP_ALREADY_PAUSED_MSG, variant: "info", duration: 3000 } }) } catch {}
        return
    }

    state.paused = true
    try { await client.tui.showToast({ body: { title: "DCP", message: DCP_PAUSED_MSG, variant: "info", duration: 3000 } }) } catch {}
    logger.info("DCP paused by user")
}

export async function handleResumeCommand(ctx: PauseCommandContext): Promise<void> {
    const { client, state, logger } = ctx

    if (!state.paused) {
        try { await client.tui.showToast({ body: { title: "DCP", message: DCP_ALREADY_ACTIVE_MSG, variant: "info", duration: 3000 } }) } catch {}
        return
    }

    state.paused = false
    try { await client.tui.showToast({ body: { title: "DCP", message: DCP_RESUMED_MSG, variant: "info", duration: 3000 } }) } catch {}
    logger.info("DCP resumed by user")
}
