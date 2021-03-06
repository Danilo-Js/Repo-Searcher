import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/Container/index';
import {
  Loading,
  Owner,
  IssueList,
  PreviousPage,
  NextPage,
  PageContainer,
} from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    page: 0,
  };

  componentDidMount() {
    this.catchIssues(true);
  }

  async catchIssues(isNextPage) {
    const { page } = this.state;
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    let newPage = page;
    if (isNextPage) {
      newPage = newPage + 1;
    } else {
      if (page === 1) {
        return;
      }
      newPage = newPage - 1;
    }

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
          page: newPage,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
      page: newPage,
    });
  }

  render() {
    const { repository, issues, loading, page } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueList>
          {issues.map((issue) => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  <text>{issue.state}</text>
                  {issue.labels.map((label) => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>

        <PageContainer>
          <PreviousPage onClick={() => this.catchIssues(false)} page={page}>
            <p>Anterior</p>
          </PreviousPage>
          <NextPage onClick={() => this.catchIssues(true)}>
            <p>Próxima</p>
          </NextPage>
        </PageContainer>
      </Container>
    );
  }
}
