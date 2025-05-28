import * as core from '@actions/core';
import { context as githubContext } from '@actions/github';
import type { GitHubContextWithPayload, GoogleChatMessage } from './types';

/**
 * Create Google Chat cardsV2 message
 * @param context - GitHub context
 * @param title - Message title
 * @param text - Plain text message
 * @returns Google Chat message object
 */
function createChatMessage(
  context: GitHubContextWithPayload,
  title: string,
  subtitle: string,
  text: string
): GoogleChatMessage {
  const { payload, ref, sha, actor, repo, workflow, runId } = context;

  // Extract commit info
  const commitMessage = payload.head_commit?.message ?? subtitle ?? '';
  const authorName = payload.head_commit?.author?.name ?? actor ?? 'Unknown';
  const repoFullName = `${repo.owner}/${repo.repo}`;
  const branchName = ref;

  // Generate URLs
  const repoUrl = `https://github.com/${repoFullName}`;
  const runUrl = `https://github.com/${repoFullName}/actions/runs/${runId}`;
  const commitUrl = `https://github.com/${repoFullName}/commit/${sha}`;

  // Create cardsV2 message
  const message: GoogleChatMessage = {
    text: text || title,
    cardsV2: [
      {
        cardId: 'github-action-notification',
        card: {
          header: {
            title: title,
            subtitle: commitMessage,
            imageUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
            imageType: 'CIRCLE',
            imageAltText: 'GitHub Logo',
          },
          sections: [
            {
              header: 'Repository Information',
              widgets: [
                {
                  decoratedText: {
                    startIcon: {
                      knownIcon: 'BOOKMARK',
                    },
                    topLabel: 'Repository',
                    text: repoFullName,
                  },
                },
                {
                  decoratedText: {
                    startIcon: {
                      knownIcon: 'TICKET',
                    },
                    topLabel: 'Branch',
                    text: branchName,
                  },
                },
                {
                  decoratedText: {
                    startIcon: {
                      knownIcon: 'AIRPLANE',
                    },
                    topLabel: 'Workflow',
                    text: workflow,
                  },
                },
                {
                  buttonList: {
                    buttons: [
                      {
                        text: 'Go to repo',
                        onClick: {
                          openLink: {
                            url: repoUrl,
                          },
                        },
                      },
                      {
                        text: 'Go to action run',
                        onClick: {
                          openLink: {
                            url: runUrl,
                          },
                        },
                      },
                      {
                        text: 'Go to commit',
                        onClick: {
                          openLink: {
                            url: commitUrl,
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
            {
              header: 'Execution Information',
              widgets: [
                {
                  decoratedText: {
                    startIcon: {
                      knownIcon: 'PERSON',
                    },
                    topLabel: 'Author',
                    text: authorName,
                  },
                },
                {
                  decoratedText: {
                    startIcon: {
                      knownIcon: 'STAR',
                    },
                    topLabel: 'Commit SHA',
                    text: sha.substring(0, 7),
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  };

  return message;
}

/**
 * Send message to Google Chat
 * @param webhookUrl - Google Chat webhook URL
 * @param message - Message object
 */
async function sendToGoogleChat(webhookUrl: string, message: GoogleChatMessage): Promise<unknown> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    core.info(`Message sent successfully: ${response.status}`);
    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to send message to Google Chat: ${errorMessage}`);
  }
}

/**
 * Main function
 */
async function run(): Promise<void> {
  try {
    // Get inputs
    const webhookUrl = core.getInput('webhook_url', { required: true });
    const title = core.getInput('title') || 'GitHub Action Notification';

    // Get GitHub context first to access commit message
    const context = githubContext as GitHubContextWithPayload;
    const subtitle = context.payload.head_commit?.message ?? '';

    const text = core.getInput('text') || '';

    core.info(`Sending notification: ${title}`);
    core.info(`Repository: ${context.repo.owner}/${context.repo.repo}`);
    core.info(`Workflow: ${context.workflow}`);

    // Create message
    const message = createChatMessage(context, title, subtitle, text);

    // Send to Google Chat
    await sendToGoogleChat(webhookUrl, message);

    core.info('Notification sent successfully!');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    core.setFailed(`Action failed: ${errorMessage}`);
  }
}

// Run the action
if (require.main === module) {
  void run();
}

export { run, createChatMessage, sendToGoogleChat };
