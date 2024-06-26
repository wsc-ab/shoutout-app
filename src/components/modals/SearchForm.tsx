import React, {useEffect, useState} from 'react';
import {
  Index,
  InstantSearch,
  useInstantSearch,
} from 'react-instantsearch-hooks';

import {ScrollView, StyleSheet} from 'react-native';
import {THitItem} from '../../types/Algolia';
import {searchClient} from '../../utils/Algolia';

import {Hits} from '../search/Hits';

import SearchBox from '../search/SearchBox';

type TProps = {
  indexes: {name: string}[];
  renderItem: (item: THitItem) => React.ReactElement | null;
};

const SearchForm = ({indexes, renderItem}: TProps) => {
  const [input, setInput] = useState('');

  return (
    <ScrollView style={styles.container}>
      <InstantSearch searchClient={searchClient} indexName={indexes[0].name}>
        <Refresh />
        <SearchBox style={styles.searchBox} onChange={setInput} input={input} />
        {indexes.map(({name}) => (
          <Index indexName={name} key={name}>
            <Hits renderItem={renderItem} />
          </Index>
        ))}
      </InstantSearch>
    </ScrollView>
  );
};

export default SearchForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 100,
  },

  searchBox: {marginBottom: 10},
});

const Refresh = () => {
  const {refresh} = useInstantSearch();
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    if (!refreshed) {
      refresh();
      setRefreshed(true);
    }
  }, [refresh, refreshed]);

  return null;
};
