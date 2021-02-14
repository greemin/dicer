import React from 'react';
import App from './App';
import renderer from 'react-test-renderer';

//it('renders without crashing', () => {
//  const tree = renderer.create(<App />).toJSON();
//
//  expect(tree).toMatchSnapshot();
//});

it('should render 1 child', () => {
  const tree = renderer.create(<App />).root;

  expect(tree.children.length).toBe(1);
});
