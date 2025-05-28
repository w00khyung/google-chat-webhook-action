# Google Chat Webhook Action

A GitHub Action that sends GitHub Actions notifications to Google Chat using cardsV2 format.

## Features

- 🔔 Automatic Google Chat notifications when GitHub Actions run
- 📱 Beautiful card messages in cardsV2 format
- 🔗 Buttons for direct navigation to repository, action run, and commit
- 📝 Commit message automatically displayed as subtitle
- ⚙️ Customizable title and message
- 💪 Written in TypeScript for better type safety

## Usage

### Basic Usage

```yaml
name: Google Chat Notification
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send Google Chat notification
        uses: w00khyung/google-chat-webhook-action@v1
        with:
          webhook_url: ${{ secrets.GOOGLE_CHAT_WEBHOOK_URL }}
          title: 'Deployment Started: ${{ github.repository }}'
```

### Advanced Usage

```yaml
- name: Send custom notification
  uses: w00khyung/google-chat-webhook-action@v1
  with:
    webhook_url: ${{ secrets.GOOGLE_CHAT_WEBHOOK_URL }}
    title: '🚀 Deployment Complete'
    text: 'Deployment has been completed <users/all>'
```

### Failure Notification

```yaml
- name: Notify failure
  if: failure()
  uses: w00khyung/google-chat-webhook-action@v1
  with:
    webhook_url: ${{ secrets.GOOGLE_CHAT_WEBHOOK_URL }}
    title: '❌ Deployment Failed'
    text: 'Deployment failed. Please check the logs.'
```

## Input Parameters

| Parameter      | Required | Default                      | Description             |
| -------------- | -------- | ---------------------------- | ----------------------- |
| `webhook_url`  | ✅       | -                            | Google Chat Webhook URL |
| `title`        | ❌       | `GitHub Action Notification` | Notification title      |
| `text`         | ❌       | `""`                         | Plain text message      |
| `github_token` | ❌       | `${{ github.token }}`        | GitHub API token        |

## Setting up Google Chat Webhook URL

1. Select a space in Google Chat
2. Click the ▼ next to the space name and select "Manage webhooks"
3. Click "Add webhook"
4. Set a name and avatar, then click "Save"
5. Copy the generated Webhook URL
6. Add it as `GOOGLE_CHAT_WEBHOOK_URL` in your GitHub repository's Settings > Secrets and variables > Actions

## Message Format

This action creates cards containing the following information:

### Header

- Title (custom or default)
- Subtitle (automatically uses commit message)
- GitHub logo

### Repository Information

- Repository name
- Branch name
- Workflow name
- Quick action buttons (repository, action run, commit)

### Execution Information

- Author name
- Commit SHA (first 7 characters)

## Example Output

The generated Google Chat message looks like this:

```json
{
  "text": "Deployment Started: myorg/myrepo",
  "cardsV2": [
    {
      "cardId": "github-action-notification",
      "card": {
        "header": {
          "title": "Deployment Started: myorg/myrepo",
          "subtitle": "fix: Add Google Chat notification feature",
          "imageUrl": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
          "imageType": "CIRCLE",
          "imageAltText": "GitHub Logo"
        },
        "sections": [...]
      }
    }
  ]
}
```

## Development

This project is written in TypeScript. To contribute:

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Lint

```bash
npm run lint
```

### Type Check

```bash
npm run type-check
```

## License

MIT License

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## Support

If you have any issues or feature requests, please create an [Issue](https://github.com/w00khyung/google-chat-webhook-action/issues).
