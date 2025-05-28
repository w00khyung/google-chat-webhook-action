const { createChatMessage } = require('./index');

describe('Google Chat Webhook Action', () => {
  const mockContext = {
    payload: {
      head_commit: {
        message: 'fix: update notification system',
        author: {
          name: 'testuser',
        },
      },
    },
    ref: 'refs/heads/main',
    sha: 'a1b2c3d4e5f6g7h8i9j0',
    actor: 'testuser',
    repo: {
      owner: 'testorg',
      repo: 'testrepo',
    },
    workflow: 'Test Workflow',
    runId: 12345,
  };

  test('should create valid Google Chat message', () => {
    const title = 'Test Notification';
    const subtitle = 'Test Subtitle';
    const text = 'Test message';

    const message = createChatMessage(mockContext, title, subtitle, text);

    expect(message).toHaveProperty('text');
    expect(message).toHaveProperty('cardsV2');
    expect(message.cardsV2).toHaveLength(1);
    expect(message.cardsV2[0].card.header.title).toBe(title);
    expect(message.cardsV2[0].card.sections).toHaveLength(2);
  });

  test('should handle missing commit info gracefully', () => {
    const contextWithoutCommit = {
      ...mockContext,
      payload: {},
    };

    const message = createChatMessage(contextWithoutCommit, 'Test', '', '');

    expect(message).toHaveProperty('cardsV2');
    expect(message.cardsV2[0].card.sections[1].widgets[0].decoratedText.text).toBe('testuser');
  });
});
