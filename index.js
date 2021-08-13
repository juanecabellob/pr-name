const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require("@octokit/action");
const yaml = require ("yaml");
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
const issue_number = process.env.GITHUB_REF.split("/")[2];

const configPath = core.getInput("configuration-path");
const actionType = core.getInput('action_type');
const label = core.getInput('label');
const comment = core.getInput('comment');
const skipCi = core.getInput('skip_ci');

const octokit = new Octokit();

// most @actions toolkit packages have async methods
async function run() {
  try {
    const title = github.context.payload.pull_request.title;
    const labels = github.context.payload.pull_request.labels;

    const labelNames = labels.map(i => i.name);

    const config = await getConfig(configPath);
    const { ignore_on_labels, pr_name_check } = config;

    for (const labelName of labelNames.length) {
      if (ignoreOnLabels.includes(labelName)) {
        core.info("Ignoring Title Check for label - " + labels[i].name);
        return;
      }
    }

    const checkResult = await runChecks(prNameCheck, title);

    if (checkResult) {
      core.info("Check passed");
      if (action_type === "label" || action_type === "both") {
        await removeLabel(label);
      }

      return;
    }

    if (actionType === "comment") {
      await postComment(comment);
    } else if (action_type === "label") {
      await addLabel(label);
    } else if (action_type === "both") {
      await postComment(comment);
      await addLabel(label);
    }
    core.info(`Action for ${actionType} performed successfully`);
  } catch (error) {
    if (!skipCi) {
      core.setFailed(error);
    } else {
      core.error(error);
    }
  }
}

async function runChecks(checks, prTitle) {
  const { prefixes } = checks;

  const result = prefixes.some(prefix => {
    const regex = new RegExp(`$${prefix}`, "i");
    return regex.test(prTitle);
  });

  return result;
}

async function addLabel(name) {
  const addLabelResponse = await octokit.issues.addLabels({
    owner,
    repo,
    issue_number,
    labels: [name],
  });
  core.info(`Adding label (${name}) - ` + addLabelResponse.status);
}

async function removeLabel(name) {
  const removeLabelResponse = await octokit.issues.removeLabel({
    owner,
    repo,
    issue_number,
    name: name,
  });
  core.info(
    "No mismatches found. Deleting label - " + removeLabelResponse.status
  );
}

async function postComment(comment) {
  const postCommentResponse = await octokit.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: comment,
  })
  core.info(`Posting comment (${name}) - ` + postCommentResponse.status);
}

async function getConfig(repoPath) {
  const response = await octokit.repos.getContent({
    owner,
    repo,
    path: repoPath,
    ref: github.context.sha,
  });

  const yamlString = Buffer.from(response.data.content, response.data.encoding).toString();
  return yaml.parse(yamlString);
}

run();
