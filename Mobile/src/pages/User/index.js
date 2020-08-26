import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Star,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 0,
    refreshing: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });

    const { navigation } = this.props;
    let { page } = this.state;

    const user = navigation.getParam('user');

    page += 1;
    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({
      page,
      stars: response.data,
      loading: false,
    });
  }

  loadMore = async () => {
    const { navigation } = this.props;
    const { stars } = this.state;
    let { page } = this.state;

    const user = navigation.getParam('user');

    page += 1;
    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({
      page,
      stars: [...stars, ...response.data],
    });
  };

  refreshList = async () => {
    console.tron.log(`foi1`);

    this.setState({
      refreshing: true,
      stars: [],
      page: 0,
      loading: true,
    });
    console.tron.log(`foi2`);

    const { navigation } = this.props;
    let { page } = this.state;

    console.tron.log(`foi3`);

    const user = navigation.getParam('user');

    page += 1;
    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    console.tron.log(`foi4`);

    this.setState({
      page,
      stars: response.data,
      refreshing: false,
      loading: false,
    });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Star
            data={stars}
            keyExtractor={(star) => String(star.id)}
            onEndReachedThresold={0.2}
            onEndReached={this.loadMore}
            onRefresh={() => this.refreshList()}
            refreshing={refreshing}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
