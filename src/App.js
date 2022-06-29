import React, { useCallback, useEffect, useState } from 'react'
import RichTextEditor from 'react-rte';
import EditorComponent from './component/Editor';

import SwitchComponent from './component/Switch'
import TableComponent from './component/Table';
import token from './variable/token';
import { frameApi } from './variable/api-link';

import "./App.css"

// const data = [
//   {
//     item:'Apple',
//     cost:40
//   },
//   {
//     item:'Orange',
//     cost:30
//   },
//   {
//     item:'Banana',
//     cost:50
//   }
// ]

const initialText = "apples   44.0 <br>dsfsdf mangoes  45.0 <br>peaches  46.0 <br>This is not match <br>banana  16.5 <br>Another sentence <br>oranges 30.5 <br>dfsdf <br>Laptop 50000.00"
const initialRegex = "^(?P<Item>\\w+)\\s+(?P<Cost>\\d+(?:.\\d+)).*$"

function App() {

  const [checkedText, setCheckedText] = useState(true);
  const [checkedRegex, setCheckedReges] = useState(true);
  const [checkedTable, setCheckedTable] = useState(true);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  // const [textUpdated, setTextUpdated] = useState("");

  const [value, setValue] = useState(RichTextEditor.createValueFromString(initialText, 'html'));
  const [regexValue, setRegexValue] = useState(RichTextEditor.createValueFromString(initialRegex, 'markdown'));

  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: 'Item',
  //       accessor: 'item'
  //     },
  //     {
  //       Header: 'Cost',
  //       accessor: 'cost'
  //     }
  //   ],[]
  // );
  // const fetchOffsetsApi = useCallback( async (text, regex, apiLink) =>{
  //   try{
  //     const response = await fetch(apiLink,{
  //       method:'POST',
  //       body: JSON.stringify({
  //         "flags": {multiline:1},
  //         "regex": regex,
  //         "text": text
  //      }),
  //       headers:{
  //         'Authorization': `Bearer ${token}` ,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     const result = await response.json();
  //     const matches = result.result.matches;
  //     console.log(result.result.matches)
  //     let updatedText = text;
  //     for(let i = matches.length-1; i>=0; i--){
  //       const [word, start, end] = matches[i].match;
  //       console.log(matches[i], word)
  //       updatedText = updatedText.replace(updatedText.slice(start, end), `<div className="has-background-info">${updatedText.slice(start, end)}</div>`)
        
  //     }
  //     updatedText.replace(/\n/g, )
  //     console.log(updatedText)
  //     setTextUpdated(updatedText)

  //   }catch(error){
  //     console.log(error);
  //   }
  // }, [])



  const fetchApiData = useCallback( async (text, regex, apiLink) => {
    try{
      const response = await fetch(apiLink,{
        method:'POST',
        body: JSON.stringify({
          "flags": {multiline:1},
          "regex": regex,
          "text": text
       }),
        headers:{
          'Authorization': `Bearer ${token}` ,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      const tableData = result.result.table.data || []
      const tableSchema = result.result.table.schema || []
      console.log(result)
      
      let tableBody = [];
      for(let i in tableData){
        tableBody.push(tableData[i])
      }

      let tableHeader = [];
      for(let j in tableSchema.fields){
        const fields = tableSchema.fields;
        console.log(tableSchema.fields[j])
        
        if(j>=2){
          tableHeader.push({
            Header: fields[j].name,
            accessor: fields[j].name
          })
        }
      }
      console.log(tableHeader)

      setColumns(tableHeader)
      setData(tableData)
      // if(!response.ok){
      //   throw new Error("Something Went Wrong");
      // }
    }catch(error){
      console.log(error);
      setData([]);
      setColumns([])
    }
  }, []);

  useEffect(()=>{
    const text = value.toString('markdown');
    let htmlText = regexValue.toString('html')
    htmlText = htmlText.replace('<p>', '')
    htmlText = htmlText.replace('</p>', '')
    htmlText = htmlText.replace(/&lt;/g, '<')
    htmlText = htmlText.replace(/&gt;/g, '>')
    htmlText = htmlText.replace(/&nbsp;/g, '')

    const identifier = setTimeout(() =>{
      console.log("fetch data")
      fetchApiData(text, htmlText, frameApi)
      // fetchOffsetsApi(text, regex, offsetsApi)
     
    }, 500);

    return ()=>{
      console.log("CLEANUP")
      clearTimeout(identifier)
    }
  },[value, regexValue, fetchApiData])

  
  console.log(checkedText)
  console.log(value.toString('markdown'))

  return (
    <>
      <section className="hero is-link">
        <div className="hero-body">
          <p className="title">
            The React Task
          </p>
          <p className="subtitle">
            It is created for extract data from raw data
          </p>
        </div>
      </section>
      
      <section className="section">
        <hr/>
        <SwitchComponent text={"Text View"} checked={checkedText} setChecked={setCheckedText} />
        { checkedText && <EditorComponent text={"File Text"} value={value} setValue={setValue} placeholder=' '/> }
        <hr/>
        
        <SwitchComponent text={"Regex View"} checked={checkedRegex} setChecked={setCheckedReges} />
        { checkedRegex && <EditorComponent text={"Regex"} value={regexValue} setValue={setRegexValue} placeholder=' '/>}
        <hr/>

        <SwitchComponent text={"Table View"} checked={checkedTable} setChecked={setCheckedTable} />
        { checkedTable && <TableComponent text={"Extracted Table"} columns={columns} data={data}/>}
        <hr/>

      </section>
    </>
  )
}

export default App
