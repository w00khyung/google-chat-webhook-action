import { describe, test, expect } from '@jest/globals';
import { createChatMessage } from './index';
import type { GitHubContextWithPayload } from './types';

describe('Google Chat Webhook Action', () => {
  const mockContext: GitHubContextWithPayload = {
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
    // Add required properties from Context interface
    job: 'test',
    runNumber: 1,
    action: 'test',
    eventName: 'push',
    serverUrl: 'https://github.com',
    apiUrl: 'https://api.github.com',
    graphqlUrl: 'https://api.github.com/graphql',
    issue: {
      owner: 'testorg',
      repo: 'testrepo',
      number: 1,
    },
  } as GitHubContextWithPayload;

  test('should create valid Google Chat message', () => {
    const title = 'Test Notification';
    const subtitle = 'Test Subtitle';
    const text = 'Test message';

    const message = createChatMessage(mockContext, title, subtitle, text);

    expect(message).toHaveProperty('text');
    expect(message).toHaveProperty('cardsV2');
    expect(message.cardsV2).toHaveLength(1);
    expect(message.cardsV2[0]?.card.header?.title).toBe(title);
    expect(message.cardsV2[0]?.card.sections).toHaveLength(2);
  });

  test('should handle missing commit info gracefully', () => {
    const contextWithoutCommit: GitHubContextWithPayload = {
      payload: {},
      ref: mockContext.ref,
      sha: mockContext.sha,
      actor: mockContext.actor,
      repo: mockContext.repo,
      workflow: mockContext.workflow,
      runId: mockContext.runId,
      job: mockContext.job,
      runNumber: mockContext.runNumber,
      action: mockContext.action,
      eventName: mockContext.eventName,
      serverUrl: mockContext.serverUrl,
      apiUrl: mockContext.apiUrl,
      graphqlUrl: mockContext.graphqlUrl,
      issue: mockContext.issue,
    } as GitHubContextWithPayload;

    const message = createChatMessage(contextWithoutCommit, 'Test', '', '');

    expect(message).toHaveProperty('cardsV2');
    expect(message.cardsV2[0]?.card.sections[1]?.widgets[0]?.decoratedText?.text).toBe('testuser');
  });
});
