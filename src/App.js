import {useEffect, useState} from "react";
import supabase from "./supabase";
import "./stle.css";
const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];
const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function Counter(){
  const [count, setCount]= useState(0);
  
  return (<div>
    <span style={{fontSize: '40px'}}>{count}</span>
    <button className="btn btn-large"onClick={()=>setCount((c)=>c+1)}>+1</button>
  </div>)
}

function App(){
  const [showForm,setShowForm]= useState(false);
  const [facts,setFacts] = useState([]);
  const[isLoading,setisLoading]=useState(false);
  const[currentCategory,setCurrentCategory]=useState("all");
  
  useEffect(function(){
    async function getFacts(){
      setisLoading(true);
      let query=supabase.from('facts').select('*');
      if(currentCategory!=='all')
        query=query.eq("category",currentCategory);
      let { data: facts, error } = await query
      .order('votesforintereting',{ascending:false}).limit(1000);
      if(!error)setFacts(facts);
      else alert("There was a problem getting  data");
      setisLoading(false);
      
    }
    getFacts();
  },[currentCategory])
  return(
  <>
    <Header showForm={showForm} setShowForm={setShowForm}/>
    {showForm ? <NewFactForm setFacts={setFacts} setShowForm={setShowForm}/> : null}
    <main>
    <CategoryFilter setCurrentCategory={setCurrentCategory}/>
      {isLoading?<Loader/>:<FactList facts={facts} setFacts={setFacts}/>}
    
    
    </main></>);    
}
function Loader(){
  return(
    <p className="message">Loading.....</p>
  )
}

function Header({showForm, setShowForm}){
  return(<header>
    <div className="logo">
    <img src="logo.png" height="68"
    width="68" alt="Lets Learn New Today Logo"/>
    <h1>Learn New Today</h1>
    </div>
    <button className="btn btn-large btn-open" onClick={()=> setShowForm((show)=>!show)} >{showForm?"Close":"Share a fact"}</button>
    </header>)
}
function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
function NewFactForm({setFacts,setShowForm}){
  const[text,setText]= useState("");
  const[source,setSource]= useState("");
  const[category,setCategory]= useState("");
  const[isUploading,setIsUploading]=useState(false);
  const textLength=text.length;
  async function handleSubmit(e){
    e.preventDefault();
    console.log(text,source,category);

    if(text && isValidHttpUrl(source) && category && textLength<=200){
      // const newFact={
      //   id: Math.round(Math.random()*1000000),
      //   text,
      //   source,  
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // }
      setIsUploading(true);
      const {data:newFact,error} = await supabase.from("facts").insert([{text,source,category}]).select();setIsUploading(false);
      if(!error)
      setFacts((facts)=>[newFact[0],...facts]);
      setText("");
      setSource("");
      setCategory("");
      setShowForm(false);


    }
  }
  return (<form onSubmit={handleSubmit}><input type="text" placeholder="Share a fact to the World" value={text} onChange={(e)=> setText(e.target.value)}disabled={isUploading}/>
  <span className="num">{200-textLength}</span>
  <input value={source}type="text" placeholder="Source..."onChange={(e)=>setSource(e.target.value)}disabled={isUploading}/>
  <select value={category} onChange={(e)=>setCategory(e.target.value)}disabled={isUploading}>
      <option value="">Select the category</option>
      {CATEGORIES.map((cat)=>(<option key={cat.name} value={cat.name}>{cat.name.toUpperCase()}</option>))}
  </select>
  <button className="btn btn-large" disabled={isUploading}>Post</button></form>);
}

function CategoryFilter({setCurrentCategory}){
  return (<aside><ul><li className="category"><button className="btn btn-all-categories" onClick={()=>setCurrentCategory('all')}>ALL</button></li>{CATEGORIES.map((cat)=>(<li key={cat.name}className="category"><button button className="btn btn-categories" style={{backgroundColor: cat.color}} onClick={()=>setCurrentCategory(cat.name)}>{cat.name}</button></li>))}</ul></aside>);
}

function FactList({facts,setFacts}){
  if(facts.length===0){
    return(<p className="message">No facts for this category yet! Create your first one:)</p>)
  }
  return (<section><ul className="facts-list">{
    facts.map((ft)=>(<Fact key={ft.id} ft={ft} setFacts={setFacts}/>   
    ))
  }</ul><p>There are {facts.length} facts in the database. Add your own!</p></section>);
};

function Fact({ft,setFacts}){
  const [isUpdating,setIsUpdating]=useState(false);
  const isDisputed= ft.votesforintereting+ft.votesformindblowing < ft.votefalse;
  async function handleVote(columnName){
    setIsUpdating(true);
    const{data:updatedFact,error}=await supabase.from('facts').update({[columnName]:ft[columnName]+1}).eq("id",ft.id).select();setIsUpdating(false);
    console.log(updatedFact);
    if(!error) setFacts((facts)=>facts.map((f)=>f.id===ft.id ? updatedFact[0] : f))
  }
  
  return(<li  className="fact">
  <p >{isDisputed?<span className="disputed">[⛔️DISPUTED]</span>:null}
      {ft.text}
      <a className= "source"href={ft.source}
      target="_blank"
      >[Source]</a> 
  </p>
  <span  className="tag"
       style={{backgroundColor: CATEGORIES.find((cat)=> cat.name === ft.category).color}}>{ft.category}</span>
  
  <div className="emoji">
      <button onClick={()=>handleVote('votesforintereting')} disabled={isUpdating}>👍 {ft.votesforintereting} </button>
      <button onClick={()=>handleVote('votesformindblowing')} disabled={isUpdating}>🤯 {ft.votesformindblowing} </button>
      <button onClick={()=>handleVote('votefalse')} disabled={isUpdating}>⛔️ {ft.votefalse} </button>
  </div>
</li> )
}

export default App;