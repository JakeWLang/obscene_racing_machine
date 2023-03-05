let nutritionSelector = document.getElementById("nutrition-selector");

let nutritionFile = 'nutrition_files/Dunkin Nutrition.csv'

function genVisuals(res) {
  let charPatt = new RegExp('^((?![A-Za-z]).)*$')

	let raw = res[0]
  let columns = raw.columns
  raw.forEach(d => {
    for (var key in d) {
      if (charPatt.test(d[key])) {
        d[key] = +d[key]
      }
    }
  });

  // Group and get group names for display
	let groupedItems = d3.group(raw, d => d['Table Type'])
  let tableTypes = []
  let groupArr = Array.from(groupedItems.entries())
  groupArr.forEach(function (k, i) { tableTypes[i] = k[0]} )
  tableTypes.splice(0, 0, 'All')

  let dd2 = new Dropdown({
    id: 'dd2',
    val: 'Select an Item Type',
    data: tableTypes,
    cb: function(newval) {
      genTable(raw, newval,
        ['Item', 'Serving Size', 'Fat',
          'Carbs', 'Protein', 'Calories from Fat',
          'Calories from Carbs', 'Calories from Protein'],
        )
    }
  });

  

}

function filterData(newval, data, filterCol) {
  console.log('You\'ve selected: ', newval)
  if (newval === 'All') { return data }
    else { return data.filter(d => d[filterCol] == newval)}
  // return data.filter(d => d['Table Type'] == newval)
}



function genTable(data, itemTypeFilter, columns) {
  tableTypeData = filterData(itemTypeFilter, data, 'Table Type')
  let table = new Tabulator('#table-space', {
    selectable: 1,
    responsiveLayout: "hide",
      layout: "fitDataFill",
    data:tableTypeData,
    // maxHeight: '100%',
    // responsiveLayout:'collapse',
    // pagination:pagination,
    // paginationSize:10,
    columns:[
      {title:'Name', field:'Item',
      cellClick: function(e, cell){
        genChart(e, cell, tableTypeData)}
      },
      {title:'Serving Size', field:'Serving Size'},
      {title:'Fat (g)', field:'Fat'},
      {title:'Carbs (g)', field:'Carbs'},
      {title:'Protein (g)', field:'Protein'}
      ]
  })
};


function genChart(e, cell, inData) {
  let colorVals = ['#22B9F1', '#F4A53C', '#B0F323']
  d3.select('svg')
    .remove()
  let item = cell._cell.initialValue
  // filter data to selected item
  // need to edit filterData so you pull selected columns, too
  let filtered = filterData(item, inData, 'Item')
  
  let wSelCols = filtered.map((d) => {
   return {
    FatCals: d['Calories from Fat'],
    CarbCals: d['Calories from Carbs'],
    ProtCals: d['Calories from Protein']}
  })

  var width = 900
    height = 450
    margin = 40

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin

  var svg = d3.select("#svg-house")
    .append('svg')
    // .attr("viewBox", `0 0 300 600`)
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr('transform', `translate(${width/2}, ${height/2})`);

  // set the color scale
  var color = d3.scaleOrdinal()
    .range(colorVals)

  var pie = d3.pie()
    .value(function(d) { return d[1]; })

  var data_ready = pie(Object.entries(wSelCols[0]))

  let arcGenerator = d3.arc()
    .innerRadius(100)         // This is the size of the donut hole
    .outerRadius(radius)

  svg
    .selectAll('slices')
    .data(data_ready)
    .join('path')
    .attr('d', arcGenerator)
    .attr('fill', function(d){ return(color(d.data[0])) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    // .style("opacity", 0.7)

  d3.select('#item-name')
    .text(filtered[0]['Item'])
    .style('padding-top', '2%')
    .style('font-family', 'Titillium Web')
    .style('font-size', '1.4em')
    .style('font-weight', 'bolder')

  svg.append("text")
   .attr("text-anchor", "middle")
   .attr('dy', '-1em')
   .style('font-family', 'Helvetica')
   .style('font-weight', '1000')
   .style('font-size', '1.15em')
   .text('Total Calories:')

  svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '1.1em')
    .style('font-family', 'Helvetica')
   .style('font-size', '1.15em')
    .text(filtered[0]['calc_cals'])

  svg
  .selectAll('slices')
  .data(data_ready)
  .enter()
  .append('text')
  .style('font-family', 'Helvetica')
  .text(function(d){
    let data = d.data[1]
    if (data != 0) return data
      else return
  })
  .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
  .style("text-anchor", "middle")
  .style("font-size", 17)

  // Add the path using this helper function
  function appendCircs(colorValues, textValues) {
    if (colorValues.length === textValues.length) {

      for (i = 0; i < colorValues.length; i++) {
        let widthOffset = 3.75;
        let heightOffset = 2.5;
        svg.append('circle')
          .attr('cx', width / widthOffset)
          .attr('cy', (-height / heightOffset) + (30 * i))
          .attr('r', 12)
          .attr('stroke', 'black')
          .attr('fill', colorValues[i]);

        svg.append('text')
          .attr('x', (width / widthOffset) + 20)
          .attr('y', (-height / heightOffset) + (30 *  i) + 5)
          .text(textValues[i])
          .style('font-family', 'Helvetica')
      }
    }
    else console.log('YOU MUST INSERT COLORS === LEN(TEXT)')
  };

  appendCircs(colorVals, ['Calories from Fat', 'Calories from Carbs', 'Calories from Protein'])



}


// step1
function Dropdown(o) {
  this.options = o;

  // step3
  window.getdd = function(elem) {
    var id = elem.closest('.dropdown').parentElement.id;
    return window.dropdowns[id];
  }

  // step1 - show val
  this.init = function() {
    this.elem = document.getElementById(this.options.id);

    //step1 + step2
    var html =
      `<div class='dropdown'>
    			<div class='dropdown_value'></div>
		          <div class='dropdown_arrow'>▾</div>
		          <div class='dropdown_panel'>
		          	<div class='dropdown_items'></div>
		          </div>
		    </div>`;

    //step4 - misc
    var self = this;
    document.addEventListener("mousedown", function() {
      if (self.isVisible) self.hide();
    });

    //step4 - misc
    if (!window.dropdowns) window.dropdowns = {};
    window.dropdowns[this.options.id] = this;


    //step4 - misc
    this.elem.style.display = 'inline-block';

    //step1
    this.elem.innerHTML = html;
    var elem = this.elem;
    this.items = elem.querySelector(".dropdown_items");
    this.value = elem.querySelector(".dropdown_value");

    //step2
    this.panel = elem.querySelector(".dropdown_panel");
    this.arrow = elem.querySelector(".dropdown_arrow");

    //step1
    var self = this;
    this.value.innerHTML = this.options.val;

    //step2
    var data = this.options.data;
    var html = "";
    data.forEach(function(elem) {
      html += `<div class='dropdown_item' onmousedown='var self=getdd(this);self.clicked(this)'>${elem}</div>`;
    });
    this.items.innerHTML = html;

    //step2
    this.elem.addEventListener('mousedown', function() {
      event.stopPropagation();

      if (self.isVisible)
        self.hide();
      else
        self.show();

    });


  }

  // step3
  this.clicked = function(elem) {
    event.stopPropagation();
    this.hide();

    var newval = elem.innerHTML;
    this.value.innerHTML = newval;

    if (this.options.cb)
      this.options.cb(newval);

  }

  // step2
  this.show = function() {
    for (var dd in window.dropdowns)
      window.dropdowns[dd].hide();

    this.isVisible = true;
    this.items.style.transform = 'translate(0px,0px)';
    this.arrow.style.transform = 'rotate(180deg)';
  }

  // step2b.
  this.hide = function() {
    if (!this.items) return;

    this.isVisible = false;
    this.items.style.transform = 'translate(0px,-255px)';
    this.arrow.style.transform = 'rotate(0deg)';
  }

  this.init();
  return this;
}

// step1 - just show val
var dd = new Dropdown({
  id: 'dd1',
  val: 'Select a Nutrition File',
  // step2 show items
  data: ['Dunkin Nutrition'],
  cb: function(newval) {
    nutritionFile = 'nutrition_files/' + newval + '.csv'
    Promise.all([
      d3.csv(nutritionFile)
      ])
        .then(genVisuals)
        .catch((err) => {
          console.log(err)
        })
  }
});
