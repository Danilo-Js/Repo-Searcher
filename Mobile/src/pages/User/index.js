import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';
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
import {TouchableOpacity} from 'react-native-gesture-handler';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
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
    this.setState({loading: true});

    const {navigation} = this.props;
    let {page} = this.state;

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
    const {navigation} = this.props;
    const {stars} = this.state;
    let {page} = this.state;

    const user = navigation.getParam('user');

    page += 1;
    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({
      page,
      stars: [...stars, ...response.data],
      refreshing: false,
    });
  };

  refreshList = () => {
    this.setState({refreshing: true, stars: [], page: 0}, this.loadMore);
  };

  handleNavigate = (repository) => {
    const {navigation} = this.props;
    navigation.navigate('Repository', {repository});
  };

  render() {
    const {navigation} = this.props;
    const {stars, loading, refreshing} = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
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
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => this.handleNavigate(item)}>
                <Starred>
                  <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              </TouchableOpacity>
            )}
          />
        )}
      </Container>
    );
  }
}
