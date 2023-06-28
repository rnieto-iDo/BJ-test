interface ILoader {
  width: string;
  height: string; 
  borderWidth: string
  color: string
}
const Index = ( {color, width, height, borderWidth}: ILoader) => (
       <div className={`loader ${color} ${height} ${width} ${borderWidth}`}/>
   
  )
export default Index;