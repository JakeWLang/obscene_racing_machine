let nutritionSelector = document.getElementById("nutrition-selector");

let nutritionFile = 'nutrition_files/Dunkin Nutrition.csv'

// nutritionSelector.addEventListener("change", function() {
// 	nutritionFile = 'nutrition_files/' + nutritionSelector.value
// 	console.log(nutritionFile)
// 	genChart(nutritionFile)
// });


const width = 400,
	height = 400,
	margin = 40;

const pie = d3.pie()

const radius = Math.min(width, height) / 2 - margin;
const color = d3.scaleOrdinal(['#22B9F1', '#F4A53C', '#B0F323'])

function genVisuals(res) {
  let charPatt = new RegExp('^((?![A-Za-z]).)*$')

	let raw = res[0]
  let columns = raw.columns
  console.log(raw)
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
  console.log('da table types', tableTypes)

  let dd2 = new Dropdown({
    id: 'dd2',
    val: 'Select an Item Type',
    data: tableTypes,
    cb: function(newval) {
      let filtered = filterData(newval, raw)
      genTable(filtered,
        ['Item', 'Serving Size', 'Fat',
          'Carbs', 'Protein', 'Calories from Fat',
          'Calories from Carbs', 'Calories from Protein'],
        )
    }
  });

  

}

function filterData(newval, data) {
  console.log('You\'ve selected: ', newval)
  if (newval === 'All') { return data }
    else { return data.filter(d => d['Table Type'] == newval)}
  // return data.filter(d => d['Table Type'] == newval)
}



function genTable(data, columns) {
  let table = new Tabulator('#table-space', {
    data:data,
    maxHeight: '100%',
    responsiveLayout:'collapse',
    // pagination:pagination,
    // paginationSize:10,
    columns:[
      {title:'Name', field:'Item', editor:'input'},
      {title:'Serving Size', field:'Serving Size'},
      {title:'Fat', field:'Fat'},
      {title:'Carbs', field:'Carbs'},
      {title:'Protein', field:'Protein'},
      {title:'Calories from Fat', field:'Calories from Fat'},
      {title:'Calories from Carbs', field:'Calories from Carbs'},
      {title:'Calories from Protein', field:'Calories from Protein'}]
  })
};





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

// var dd2 = new Dropdown({
//   id: 'dd2',
//   val: 'dog',
//   data: ['cat', 'dog', 'mouse', 'horse', 'rabbit', 'lion', 'bear', 'tiger'],
//   cb: function(newval) {
//     //alert(newval);
//   }
// });


// function selectTableType(data) {
// 	return d3.group(data, d => d.table_type)
// }

// console.log(selectTableType(loadedJson))

// let svg = d3.select('svg')
// 	.attr('width', width)
// 	.attr('class', 'nutrition')
// 	.attr('height', height)
	
// let g = svg.append('g')
// 	.attr('transform', `translate(${width/2}, ${height/2})`);

// let arc = d3.arc()
// 	.innerRadius(0)
// 	.outerRadius(radius)

// let arcs = g.selectAll('arc')
// 	.data(pie(data))
// 	.enter()
// 	.append('g')
// 	.attr('class', 'arc')

// arcs.append('path')
// 	.attr('fill', function(d, i) {
// 		return color(i);
// 	})
// 	.attr('d', arc)


