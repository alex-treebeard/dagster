import {gql} from '@apollo/client';

import {PYTHON_ERROR_FRAGMENT} from 'src/PythonErrorInfo';
import {RUN_METADATA_PROVIDER_MESSAGE_FRAGMENT} from 'src/RunMetadataProvider';
import {GANTT_CHART_EXECUTION_PLAN_FRAGMENT} from 'src/gantt/GanttChart';
import {LOGS_SCROLLING_TABLE_MESSAGE_FRAGMENT} from 'src/runs/LogsScrollingTable';
import {RUN_DETAILS_FRAGMENT} from 'src/runs/RunDetails';
import {RUN_STATUS_PIPELINE_RUN_FRAGMENT} from 'src/runs/RunStatusToPageAttributes';

export const RUN_FRAGMENT_FOR_REPOSITORY_MATCH = gql`
  fragment RunFragmentForRepositoryMatch on PipelineRun {
    id
    pipeline {
      name
    }
    pipelineSnapshotId
    repositoryOrigin {
      repositoryName
      repositoryLocationName
    }
  }
`;

export const RunFragments = {
  RunFragment: gql`
    fragment RunFragment on PipelineRun {
      ...RunStatusPipelineRunFragment

      id
      runConfigYaml
      runId
      canTerminate
      status
      mode
      tags {
        key
        value
      }
      rootRunId
      parentRunId
      pipeline {
        __typename
        ... on PipelineReference {
          name
          solidSelection
        }
      }
      pipelineSnapshotId
      executionPlan {
        steps {
          key
          inputs {
            dependsOn {
              key
              outputs {
                name
                type {
                  name
                }
              }
            }
          }
        }
        artifactsPersisted
        ...GanttChartExecutionPlanFragment
      }
      stepKeysToExecute
      ...RunFragmentForRepositoryMatch
      ...RunDetailsFragment
    }

    ${RUN_STATUS_PIPELINE_RUN_FRAGMENT}
    ${GANTT_CHART_EXECUTION_PLAN_FRAGMENT}
    ${RUN_FRAGMENT_FOR_REPOSITORY_MATCH}
    ${RUN_DETAILS_FRAGMENT}
  `,
  RunPipelineRunEventFragment: gql`
    fragment RunPipelineRunEventFragment on PipelineRunEvent {
      ... on MessageEvent {
        message
        timestamp
        level
        stepKey
      }

      ...LogsScrollingTableMessageFragment
      ...RunMetadataProviderMessageFragment
    }

    ${RUN_METADATA_PROVIDER_MESSAGE_FRAGMENT}
    ${LOGS_SCROLLING_TABLE_MESSAGE_FRAGMENT}
    ${PYTHON_ERROR_FRAGMENT}
  `,
};
