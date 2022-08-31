import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

export default function App() {

  const baseUrl = 'https://api.github.com';
  const perPage = 20;

  const [data, setData] = useState([
    /*{id:1,full_name:'prog john'},
    {id:2,full_name:'prog luana'},*/
  ]); //array de dados
  
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadEndpoint();
  }, []);

  async function loadEndpoint() {
    if(loading) return;

    setLoading(true);

    //Aguardar até que termine a chamada
    //endpoint  search/repositories?q=react&per_page=5&page=1
    //const res = await axios.get('https://api.github.com/search/repositories?q=react&per_page=20&page=1');
    const res = await axios.get(`${baseUrl}/search/repositories?q=react&per_page=${perPage}&page=${page}`);
    //passa para o setData o valor de data já existente usando o operator spread
    //Depois passa tudo q tiver dentro do response.data.items
    setData([...data, ...res.data.items]);
    setPage(page + 1);
    setLoading(false);
  } 

  return (
    <View style={styles.container}>
      <Text style={{
         textTransform:'uppercase', 
         marginTop:40, 
         color:'black', 
         fontSize:18, fontWeight:'bold',
         alignSelf:'center'}}>
          Infinite Scroll c/ paginação: {page}
      </Text>
      <FlatList 
       style={{marginTop: 8}}
       contentContainerStyle={{marginHorizontal: 20}}
       data={data}
       //Key precisa ser string
       keyExtractor={ item => String(item.id) }
       //Componente que vai ser renderizado desestrutura passando elemento
       //msçs abacate unidade valor ... o q quiser q fizer sentido
       renderItem={ ({item}) => <ListItem data={item} />}
       onEndReached={loadEndpoint}
       onEndReachedThreshold={0.15}
       ListFooterComponent={ <FooterListComponent data={loading}/>}
       //Pode customizar pelo componente - ListFooterComponentStyle={{marginTop:16, marginBottom:16, padding:16}}
      />
    </View>
  );
}

//o props do componente pega fazendo desestruturação
function FooterListComponent({data}) {
  if(!data) return null;
  return(
    <View style={{marginTop:16, marginBottom:16, padding:16}}>
      <ActivityIndicator size={28} color="purple"/>
    </View>
  ) 
}

//realizou a desestruturação dos dados passado atraves do dataValue
//de dentro de props pegar o valor dataValue  props.dataValue
function ListItem({data}) {
  return(
    <View style={styles.listItem}>
      <Text style={styles.textItem}>{data.full_name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  listItem: {
    backgroundColor: '#44BC',
    padding: 26,
    marginTop: 20,
    borderRadius: 12,    
  },
  textItem: {
   fontSize: 16,
   color: '#FFF'
  }
});
