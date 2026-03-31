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
import { sendIgnoredMessage } from "../ui/notification"
import { getCurrentParams } from "../strategies/utils"

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
    const { client, state, logger, sessionId, messages } = ctx

    if (state.paused) {
        const params = getCurrentParams(state, messages, logger)
        await sendIgnoredMessage(client, sessionId, DCP_ALREADY_PAUSED_MSG, params, logger)
        return
    }

    state.paused = true
    const params = getCurrentParams(state, messages, logger)
    await sendIgnoredMessage(client, sessionId, DCP_PAUSED_MSG, params, logger)
    logger.info("DCP paused by user")
}

export async function handleResumeCommand(ctx: PauseCommandContext): Promise<void> {
    const { client, state, logger, sessionId, messages } = ctx

    if (!state.paused) {
        const params = getCurrentParams(state, messages, logger)
        await sendIgnoredMessage(client, sessionId, DCP_ALREADY_ACTIVE_MSG, params, logger)
        return
    }

    state.paused = false
    const params = getCurrentParams(state, messages, logger)
    await sendIgnoredMessage(client, sessionId, DCP_RESUMED_MSG, params, logger)
    logger.info("DCP resumed by user")
}
