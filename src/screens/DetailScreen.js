import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Dimensions, Platform, StyleSheet, Animated, ScrollView, View, Image } from 'react-native';
import { Container, Icon, H2, Text, Button } from 'native-base';
import EStyleSheet from 'react-native-extended-stylesheet';
import Swiper from 'react-native-swiper';
import _ from 'lodash';
import { Content, Host, Menu, Review, Header, Footer } from './detail';
import { HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT, HEADER_SCROLL_DISTANCE } from './detail/constants';
import { isAuth } from '../ducks/auth';
import { withLoading as loading } from '../hocs/index';
import { NavigationActions } from 'react-navigation';

@connect(mapStateToProps, mapDispatchToProps)
@loading
class DetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      flexHeight: HEADER_MAX_HEIGHT,
      flexMarginTop: 0
    };
    this.state.scrollY.addListener(({ value }) => {
      /** ignore minHeight > currentHeight or currentHeight > maxHeight */
      const currentHeight = HEADER_MAX_HEIGHT - value;
      if (HEADER_MAX_HEIGHT < currentHeight && currentHeight < HEADER_MIN_HEIGHT) {
        return;
      }
      // console.log(currentHeight, value);
      if (currentHeight < HEADER_MIN_HEIGHT) {
        this.setState({
          flexHeight: HEADER_MIN_HEIGHT
          // flexMarginTop: HEADER_MIN_HEIGHT
        });
        return;
      }
      this.setState({
        flexHeight: currentHeight,
        flexMarginTop: value
      });
    });
  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    const { isAuth, backScreen } = this.props;
    const { flexHeight } = this.state;
    // 0 ... HEADER_MAX_HEIGHT, 0, hidden 1 ... 0
    // 0 ... HEADER_MAX_HEIGHT, 0, height 56 ... 0
    // 0 ... HEADER_MAX_HEIGHT, 0, color 0 ... 1

    return (
      <Container>
        <ScrollView
          stickyHeaderIndices={ [0] }
          scrollEventThrottle={ 16 }
          onScroll={ Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], {
            useNativeDriver: false
          }) }
          style={ styles.fill }>
          <View
            style={ {
              height: flexHeight,
              backgroundColor: 'transparent'
            } }>
            <Header scrollY={ this.state.scrollY } backPress={ backScreen } />
          </View>
          {this._renderScrollViewContent()}
        </ScrollView>
        <Footer scrollY={ this.state.scrollY } onRequest={ isAuth ? () => {} : () => navigate('Login') } />
      </Container>
    );
  }

  _renderScrollViewContent = () => {
    const contents = [{ component: Content }, { component: Host }, { component: Menu }, { component: Review }];
    const { flexMarginTop } = this.state;
    return (
      <View style={ [styles.scrollViewContent, { marginTop: flexMarginTop }] }>
        {_.map(contents, (content, index) => {
          const { component: Component } = content;
          return <Component key={ index } />;
        })}
      </View>
    );
  };
}

const styles = EStyleSheet.create({
  fill: {
    flex: 1
  },
  scrollViewContent: {
    paddingTop: 20,
    paddingBottom: 56
  }
});

function mapStateToProps(state) {
  return {
    isAuth: isAuth(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      backScreen: NavigationActions.back
    },
    dispatch
  );
}

export default DetailScreen;
