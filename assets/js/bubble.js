/*global window, d3 */
var urlStart = "//data.sfgov.org/resource/q66q-d2tr.json?filer_naml=";

var title;

var clrType= {'IND': '#12b3d6', 'OTH': '#0e6aa4'};



function bubble (error, data) {

  console.log(error, data);

  var tooltip = d3.select('body').append('div').attr('class', 'tooltip');
  var bubbleViz = d3.select('#bubble');
  var bubbleText = d3.select('#bubble-text');
  var width = 600;
  var height = 600;

  var center = {x: width/2, y:height/2};

  //var candidate = "Aaron Peskin for Supervisor";
  var candidateData = [];

  var fullData = data;


  //bubbleText.append('h3').html(title);


  function mouseover(d){

    var outp = "Name : "+ d.tran_namf+ " " +d.tran_naml+ "<br> Occupation : " + d.tran_occ+ " <br> Amount : $" + d.tran_amt1 ;

    var top = //'100px';
          d3.event.pageY + 'px';
    var left =
          //'400px'
          d3.event.pageX + 'px';

    console.log(top, left)

    tooltip
      .html(outp)
      .style('top', top)
      .style('left', left)
      .style('opacity', 0.9);

  }

  function mouseout(){

    tooltip
      .style('opacity', 0);

  }








  fullData.forEach(function(d, i){

    //if(d.filer_naml == candidate){

    //if(d.filer_naml == candidate && i<201){

    if(i<401){

      d.tran_amt1 = parseInt(d.tran_amt1);
      candidateData.push(d);

    }

  });

  var maxContri = d3.max(candidateData, function(d){ return d.tran_amt1;})

  console.log(maxContri);

  var r = d3
        .scale.pow().exponent(.8)
  //.scale.linear()
        .domain([0, 5000])
        .range([0, 80]);




  var svg = bubbleViz.append('svg')
        .attr('width', width)
        .attr('height', height);


  var force = d3.layout.force()
        .nodes(candidateData)
        .charge(-20)
  //.charge(function(d){return -r(d.tran_amt1)*8.2;})
  //.chargeDistance(10000)
        .size([width, height]);

  var node = svg
        .selectAll(".node")
        .data(candidateData)  
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('r', function (d){

          //console.log(d.tran_amt1);

          //return 10;
          return r(d.tran_amt1);
        })
  //.attr('cx', function(d){ return d.x;})
  //.attr('cy', function(d){return d.y;})
        .style('stroke', '#888')
        .style('stroke', .9)
        .style('opacity', 0.8)
        .style('fill', function(d){

          var des = d.entity_cd;
          var clr;

          if(des == 'IND' || des == 'OTH'){

            clr = clrType[des];

          }
          else{
            clr = '#fc5d2c';
          }

          return clr;

        })
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .call(force.drag);


  force.on('tick', function(e){

    var al = e.alpha;
    //console.log(al);

    //console.log(d.x, d.y);

    d3.selectAll('.node').each(function(d){


      
      //console.log(d.x, d.y);


      d.x = d.x + (center.x -d.x) *(.00009) * (al + .5 );
      d.y = d.y + (center.y- d.y) *(.00009) * (al + .5 );

      d3.select(this)
        .attr('cx', function(d){ return d.x;})
        .attr('cy', function(d){return d.y;})


    });
    

  }).start();          
  



  // Attach L.LatLng objects to the data records; omit records with no location.
  var records = [];
  for (var i = 0; i < candidateData.length; i++) {
    if (candidateData[i].tran_location) {
      records.push(candidateData[i]);
    }
  }
  records.forEach(function(d) {
    d.ll = new L.LatLng(d.tran_location.latitude, d.tran_location.longitude);
  });

  // Set up the Leaflet map.
  var map = L.map('map').setView([37.8, -122], 8);
  var attribution = 'base map &copy; <a href="http://openstreetmap.org">' +
        'OpenStreetMap</a> contributors';
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: attribution, maxZoom: 18
  }).addTo(map);

  // Style the nodes using d3.
  map._initPathRoot();  // initialize the layer with the <svg> element
  var svg = d3.select('#map').select('svg'), g = svg.append('g');
  var node = g.selectAll('circle')
        .data(records)
        .enter().append('circle')
        .style('stroke', '#777')
  //.style('stroke-w')
        .style('opacity', .8)
        .style('fill', function(d){

          var des = d.entity_cd;
          var clr;

          if(des == 'IND' || des == 'OTH'){

            clr = clrType[des];

          }
          else{
            clr = '#fc5d2c';
          }

          return clr;

        })
        .attr('r', function(d) {
          var size = Math.sqrt(d.tran_amt1 / 25);  // $1 -> 0.2, $2500 -> 10
          return size < 1 ? 1 : size > 10 ? 10 : size;
        });
  map.on('viewreset', update);  // recompute screen positions after a zoom
  update();

  function update() {
    node.attr('transform', function(d) {
      var p = map.latLngToLayerPoint(d.ll);
      return 'translate(' + p.x + ',' + p.y + ')';
    });
  }






  console.log(candidateData);











}




function loadPage (error, data){


  var candidates = data;

  //console.log(candidates);




  for (cand in candidates){

    var obj = candidates[cand];

    var first = obj.first;
    var last = obj.last;

    var fullname = first + " " +last;
    //var cmt =  candidates[cand].cmt_name.name;

    //.log(cmt)

    //console.log(obj.details)

    if(obj.details != undefined){


      d3.select('#candidate')
        .append('option')
        .attr('value', obj.details.name )
        .attr('name', fullname)
        .html(fullname)

      /*
       
       .on('change', function(){

       var stringEnd = d3.select(this)
       .attr('value');

       var url = urlStart + stringEnd;                  


       




       })
       */






    }



    d3.select('#select')
      .on('change', function(){
        var selector = document.getElementById('candidate');
        var filer = selector.options[selector.selectedIndex].value;
        var cdName = selector.options[selector.selectedIndex].innerHTML;

        console.log(cdName)

        d3.select('#bubble-text').html('');

        d3.select('#bubble').remove();
        d3.select('#map').remove();


        d3.select('#main').append('div').attr('id', 'bubble');
        d3.select('#main').append('div').attr('id', 'map');
        

        d3.select('#bubble-text').append('h3').html(cdName);



        var url = urlStart + filer;

        //title = filer;

        console.log(url)

        queue()
          .defer(d3.json, url)
        //.defer(fs.stat, __dirname + "/../package.json")
          .await(bubble);


      })




    

    
  }











}



queue()
  .defer(d3.json, '/data/candidates2.json')
//.defer(fs.stat, __dirname + "/../package.json")
  .await(loadPage);
