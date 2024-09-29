let educationUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
let countyUrl ="https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let countyData
let educationData

let canvas = d3.select('#canvas');
let tooltip = d3.select('#tooltip');

let drawMap=()=>{
   canvas.selectAll('path')
         .data(countyData)
         .enter()
         .append('path')
         .attr('d', d3.geoPath())
         .attr('class', 'county')
         .attr('fill', (countyDataItem)=>{
            let id = countyDataItem['id']
            let county = educationData.find((item)=>{
                return item['fips'] === id
            })
            let percentage = county['bachelorsOrHigher']
            if(percentage <= 15){
                return "#fff2fe"
            }else if(percentage <= 30){
                return '#ffbdf7'
            }else if(percentage <= 45){
                return '#ff6eee'
            }else{
                return '#fc03df'
            }
         })
         .attr('data-fips', (countyDataItem)=>{
            return countyDataItem['id']
         })
         .attr('data-education', (countyDataItem)=>{
            let id = countyDataItem['id']
            let county = educationData.find((item)=>{
                return item['fips'] === id
            })
            let percentage = county['bachelorsOrHigher']
            return percentage
         })
         .on('mouseover', (event, d)=>{
            tooltip.transition()
            .style('visibility', 'visible') 
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 20) + 'px')
            
 

            let id = d['id']
            let county = educationData.find((item) => {
                return item['fips'] === id
            })     
            
                   
                   if (county) {
                    tooltip.text(county['fips'] + '-' + county['area_name'] + ',' + county['state'] + ':' + county['bachelorsOrHigher'] + '%')
                    tooltip.attr('data-education', county['bachelorsOrHigher'])
                } else {
                    tooltip.text('Data not found')
                }
            

         })
         .on('mouseout', (event, d)=>{
            tooltip.transition()
                   .style('visibility', 'hidden')
         })
}

d3.json(countyUrl).then(
    (data, error)=>{
        if(error){
            console.log(error);
        }else{
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData);

            d3.json(educationUrl).then(
                (data,error)=>{
                    if(error){
                        console.log(error);
                    }else{
                        educationData = data
                        console.log(educationData)
                        drawMap();
                    }
                }
            )
        }
    }
)