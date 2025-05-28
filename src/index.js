const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

/**
 * Create Google Chat cardsV2 message
 * @param {Object} context - GitHub context
 * @param {string} title - Message title
 * @param {string} subtitle - Message subtitle
 * @param {string} text - Plain text message
 * @returns {Object} Google Chat message object
 */
function createChatMessage(context, title, subtitle, text) {
  const { payload, ref, sha, actor, repo, workflow, runId } = context;

  // Extract commit info
  const commitMessage = payload.head_commit?.message || subtitle || '';
  const authorName = payload.head_commit?.author?.name || actor || 'Unknown';
  const repoFullName = `${repo.owner}/${repo.repo}`;
  const branchName = ref;

  // Generate URLs
  const repoUrl = `https://github.com/${repoFullName}`;
  const runUrl = `https://github.com/${repoFullName}/actions/runs/${runId}`;
  const commitUrl = `https://github.com/${repoFullName}/commit/${sha}`;

  // Create cardsV2 message
  const message = {
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
              header: '레포지토리 정보',
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
                      knownIcon: 'BOOKMARK',
                    },
                    topLabel: '브랜치',
                    text: branchName,
                  },
                },
                {
                  decoratedText: {
                    startIcon: {
                      knownIcon: 'BOOKMARK',
                    },
                    topLabel: '워크플로우',
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
              header: '실행 정보',
              widgets: [
                {
                  decoratedText: {
                    startIcon: {
                      knownIcon: 'PERSON',
                    },
                    topLabel: '작성자',
                    text: authorName,
                  },
                },
                {
                  decoratedText: {
                    startIcon: {
                      knownIcon: 'STAR',
                    },
                    topLabel: '커밋 SHA',
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
 * @param {string} webhookUrl - Google Chat webhook URL
 * @param {Object} message - Message object
 */
async function sendToGoogleChat(webhookUrl, message) {
  try {
    const response = await axios.post(webhookUrl, message, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    core.info(`Message sent successfully: ${response.status}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to send message to Google Chat: ${error.message}`);
  }
}

/**
 * Main function
 */
async function run() {
  try {
    // Get inputs
    const webhookUrl = core.getInput('webhook_url', { required: true });
    const title = core.getInput('title') || 'GitHub Action Notification';
    const subtitle = core.getInput('subtitle') || '';
    const text = core.getInput('text') || '';

    // Get GitHub context
    const context = github.context;

    core.info(`Sending notification: ${title}`);
    core.info(`Repository: ${context.repo.owner}/${context.repo.repo}`);
    core.info(`Workflow: ${context.workflow}`);

    // Create message
    const message = createChatMessage(context, title, subtitle, text);

    // Send to Google Chat
    await sendToGoogleChat(webhookUrl, message);

    core.info('Notification sent successfully!');
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

// Run the action
if (require.main === module) {
  run();
}

module.exports = { run, createChatMessage, sendToGoogleChat };
