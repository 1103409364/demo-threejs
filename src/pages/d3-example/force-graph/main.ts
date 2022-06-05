import * as d3 from "d3";
import { saveAs } from "file-saver";
// interface Node {
//   name: string;
//   group: number;
//   id: string;
//   label: string;
// }

// interface Link {
//   source: string;
//   target: string;
//   type: number;
// }

const dataSet = {
  nodes: [
    // 节点名称，标签简称、全称，运行时间等
    { id: 1, name: "节点名", label: "Aggregation", group: "Team C", runtime: 20 },
    { id: 2, name: "节点名称", label: "Assessment Repository", group: "Team A", runtime: 20 },
    { id: 3, name: "测试", label: "Final Calc", group: "Team C", runtime: 20 },
    { id: 4, name: "节点名称", label: "Demographic", group: "Team B", runtime: 20 },
    { id: 5, name: "节点名称", label: "Eligibility", group: "Team B", runtime: 20 },
    { id: 6, name: "节点名称", label: "Goal Setting", group: "Team C", runtime: 20 },
    { id: 7, name: "节点名称", label: "Growth Model", group: "Team C", runtime: 20 },
    { id: 8, name: "节点名称", label: "Linkage", group: "Team A", runtime: 20 },
    { id: 9, name: "节点名称", label: "MOSL", group: "Team A", runtime: 20 },
    { id: 10, name: "节点名称", label: "MOTP", group: "Team A", runtime: 20 },
    { id: 11, name: "节点名称", label: "Reporting", group: "Team E", runtime: 20 },
    { id: 12, name: "节点名称", label: "State Data", group: "Team A", runtime: 20 },
    { id: 13, name: "节点名称", label: "Snapshot", group: "Team A", runtime: 20 },
    { id: 10000, name: "节点名称", label: "Snapshot", group: "Team A", runtime: 20 },
  ],
  links: [
    { source: 1, target: 3, type: "Next -->" },
    { source: 1, target: 2, type: "Next -->" },
    { source: 6, target: 1, type: "Next -->" },
    { source: 7, target: 1, type: "Next -->" },
    { source: 9, target: 1, type: "Next -->" },
    { source: 2, target: 4, type: "Next -->" },
    { source: 2, target: 6, type: "Next -->" },
    { source: 2, target: 7, type: "Next -->" },
    { source: 2, target: 8, type: "Next -->" },
    { source: 2, target: 9, type: "Next -->" },
    { source: 10, target: 3, type: "Next -->" },
    { source: 3, target: 11, type: "Next -->" },
    { source: 8, target: 5, type: "Go to ->" },
    { source: 8, target: 11, type: "Go to ->" },
    { source: 6, target: 9, type: "Go to ->" },
    { source: 7, target: 9, type: "Go to ->" },
    { source: 8, target: 9, type: "Go to ->" },
    { source: 9, target: 11, type: "Go to ->" },
    { source: 12, target: 9, type: "Go to ->" },
    { source: 13, target: 11, type: "Go to ->" },
    { source: 13, target: 2, type: "Go to ->" },
    { source: 13, target: 4, type: "This way>>" },
    { source: 13, target: 5, type: "This way>>" },
    { source: 13, target: 8, type: "This way>>" },
    { source: 13, target: 9, type: "This way>>" },
    { source: 13, target: 10, type: "This way>>" },
    { source: 4, target: 7, type: "Next -->" },
    { source: 10, target: 5, type: "Next -->" },
    { source: 4, target: 2, type: "Next -->" },
    { source: 5, target: 3, type: "Next -->" },
  ],
};
const width = 890;
const height = 500;

function render(dataSet) {
  const nodeRadius = 17;
  const lineOpacity = 0.5;

  const colorScale = buildColorScale(dataSet);

  //create a simulation for an array of nodes, and compose the desired forces.
  const simulation = d3
    .forceSimulation()
    .force(
      "link",
      d3
        .forceLink() // This force provides links between nodes
        .id((d) => d.id) // This sets the node id accessor to the specified function. If not specified, will default to the index of a node.
        .distance(120),
    )
    .force("charge", d3.forceManyBody().strength(-400)) // This adds repulsion (if it's negative) between nodes.
    .force("center", d3.forceCenter(width / 2, height / 2 + 10)); // 调整在画布中的位置 This force attracts nodes to the center of the svg area

  const svg = d3.select("#force-graph").append("svg").attr("viewBox", [0, 0, width, height]);
  // 分组 g1 画主要的图形，g2 画辅助的图形，分组后便与做放大平移等
  const g1 = svg.append("g").attr("cursor", "grab");
  const g2 = svg.append("g");

  const zoom = d3.zoom().scaleExtent([-20, 20]).on("zoom", zoomed); // 取消双击放大;
  function zoomed({ transform }) {
    g1.attr("transform", transform);
  }

  svg.call(zoom).on("dblclick.zoom", null);

  // const subgraphWidth = (width * 2) / 8;
  // const subgraphHeight = (height * 1) / 5;

  const subgraph = svg.append("g").attr("id", "subgraph");
  // .attr("transform", `translate(${width - subgraphWidth - 20}, 0)`);

  subgraph.append("text").attr("y", 15).style("font-size", "16px"); //  选中的组件名称

  // 标题：机器人组件 灰色边框表示运行时长
  g2.append("text")
    .text("图谱标题") // title
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", 30)
    .style("font-size", "18px");

  //appending little triangles, path object, as arrowhead
  //The <defs> element is used to store graphical objects that will be used at a later time
  //The <marker> element defines the graphic that is to be used for drawing arrowheads or polymarkers on a given <path>, <line>, <polyline> or <polygon> element.
  // 箭头
  g1.append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "-0 -5 10 10") //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
    .attr("refX", 26) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 5)
    .attr("markerHeight", 5)
    .attr("xoverflow", "visible")
    .append("svg:path")
    .attr("d", "M 0,-5 L 10 ,0 L 0,5")
    .attr("fill", "#999")
    .style("stroke", "none");

  // console.log("dataSet is ...", dataSet);

  // Initialize the links 连接线
  const link = g1
    .selectAll(".links")
    .data(dataSet.links)
    .enter()
    .append("line")
    .attr("class", "links")
    .attr("stroke", "#999")
    .attr("stroke-width", "2px")
    .style("opacity", lineOpacity)
    .attr("id", (d) => "line" + d.source + d.target)
    .attr("class", "links")
    .attr("marker-end", "url(#arrowhead)"); //The marker-end attribute defines the arrowhead or polymarker that will be drawn at the final vertex of the given shape.

  //The <title> element provides an accessible, short-text description of any SVG container element or graphics element.
  //Text in a <title> element is not rendered as part of the graphic, but browsers usually display it as a tooltip.
  link.append("title").text((d) => d.type);

  // 连线的文字
  const edgepaths = g1
    .selectAll(".edgepath") //make path go along with the link provide position for link labels
    .data(dataSet.links)
    .enter()
    .append("path")
    .attr("class", "edgepath")
    .attr("fill-opacity", 0)
    .attr("stroke-opacity", 0)
    .attr("id", function (d, i) {
      return "edgepath" + i;
    })
    .style("pointer-events", "none");

  const edgelabels = g1
    .selectAll(".edgelabel")
    .data(dataSet.links)
    .enter()
    .append("text")
    .style("pointer-events", "none")
    .attr("class", "edgelabel")
    .attr("id", function (d, i) {
      return "edgelabel" + i;
    })
    .attr("font-size", 10)
    .attr("fill", "#aaa")
    .attr("dy", "-0.3em");

  edgelabels
    .append("textPath") //To render text along the shape of a <path>, enclose the text in a <textPath> element that has an href attribute with a reference to the <path> element.
    .attr("xlink:href", function (d, i) {
      return "#edgepath" + i;
    })
    .style("text-anchor", "middle")
    .style("pointer-events", "none")
    .attr("startOffset", "50%")
    .text((d) => d.type);

  // Initialize the nodes
  const node = g1
    .selectAll(".nodes")
    .data(dataSet.nodes)
    .enter()
    .append("g")
    .attr("class", "nodes")
    // .classed("nodes", true)
    .classed("fixed", (d) => d.fx !== undefined);

  node
    .call(
      d3
        .drag() //sets the event listener for the specified typenames and returns the drag behavior.
        .on("start", dragStarted) //start - after a new pointer becomes active (on mousedown or touchstart).
        .on("drag", dragged) //drag - after an active pointer moves (on mousemove or touchmove).
        // 不加 end 的话，拖动后 cpu 占用率高
        .on("end", dragEnded), //end - after an active pointer becomes inactive (on mouseup, touchend or touchcancel).
    )
    .on("dblclick", nodeDBlclick)
    .on("mouseover", tooltipIn)
    .on("mouseout", tooltipOut);
  // 节点绘制
  node
    .append("circle")
    .attr("r", (d) => nodeRadius) //+ d.runtime/20 ) //radius of the circle
    .attr("id", (d) => "circle" + d.id)
    .style("stroke", "grey")
    .style("stroke-opacity", 0.3)
    .style("stroke-width", (d) => d.runtime / 10)
    .style("fill", (d) => colorScale(d.group));

  node
    .append("title")
    .text((d) => d.id + ": " + d.label + " - " + d.group + ", runtime:" + d.runtime + "min");
  // 节点 name
  node
    .append("text")
    .attr("dy", (d) => (d.name.length < 3 ? 0.4 : 0))
    .text((d) => d.name)
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .style("pointer-events", "none")
    .call(wrap, 25);
  /**
   * text 文本换行， 中文按字符换行
   * @param {Text} text
   * @param {Number} width
   */
  function wrap(text, width) {
    text.each(function () {
      let text = d3.select(this),
        characters = text.text().split("").reverse(),
        character,
        line = [],
        // lineNumber = 0,
        lineHeight = 1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")) || 0,
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", dy + "em");
      while ((character = characters.pop())) {
        line.push(character);
        tspan.text(line.join(""));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(""));
          line = [character];
          tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            // .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .attr("dy", lineHeight + dy + "em")
            .attr("font-size", "10px")
            .text(character);
        }
      }
    });
  }
  // 节点 runtime
  // node
  //   .append("text")
  //   .attr("dy", 12)
  //   .style("text-anchor", "middle")
  //   .style("font-size", "8px")
  //   .text((d) => d.runtime)
  //   .style("pointer-events", "none");

  // 建立邻居字典
  const neighborTarget = {};
  for (let i = 0; i < dataSet.nodes.length; i++) {
    const id = dataSet.nodes[i].id;
    neighborTarget[id] = dataSet.links
      .filter(function (d) {
        return d.source == id; // source
      })
      .map(function (d) {
        return d.target;
      });
  }
  console.log("neighborTarget is ", neighborTarget);

  const neighborSource = {};
  for (let i = 0; i < dataSet.nodes.length; i++) {
    const id = dataSet.nodes[i].id;
    neighborSource[id] = dataSet.links
      .filter(function (d) {
        return d.target == id; // target
      })
      .map(function (d) {
        return d.source;
      });
  }

  console.log("neighborSource is ", neighborSource);

  // 非邻居字典
  // let nonNeighbor = {};
  // for (let i = 0; i < dataSet.nodes.length; i++) {
  //   let id = dataSet.nodes[i].id;
  //   nonNeighbor[id] = dataSet.nodes
  //     .filter(
  //       (d) => !neighborSource[id].includes(d.id) && !neighborTarget[id].includes(d.id) && d.id != id
  //     )
  //     .map((d) => d.id);
  // }
  // console.log("nonNeighbor is ", nonNeighbor);

  // 节点事件：点击高亮，鼠标悬浮隐藏非邻居节点，鼠标离开显示所有节点
  node
    .selectAll("circle")
    .on("click", function (e, d) {
      const active = d.active ? false : true, // toggle whether node is active
        newStroke = active ? "yellow" : "grey",
        newStrokeIn = active ? "green" : "grey",
        newStrokeOut = active ? "red" : "grey",
        newOpacity = active ? 0.6 : 0.3,
        subgraphOpacity = active ? 0.9 : 0;
      // 选中节点详情
      subgraph
        .selectAll("text")
        .text("Selected: " + d.label)
        .attr("dy", 14)
        .attr("dx", 14);

      //extract node's id and ids of its neighbors
      const id = d.id,
        neighborS = neighborSource[id],
        neighborT = neighborTarget[id];
      console.log("neighbors is from ", neighborS, " to ", neighborT);
      g1.selectAll("#circle" + id).style("stroke-opacity", newOpacity);
      g1.selectAll("#circle" + id).style("stroke", newStroke);
      g1.selectAll("#subgraph").style("opacity", subgraphOpacity);
      //highlight the current node and its neighbors
      for (let i = 0; i < neighborS.length; i++) {
        g1.selectAll("#line" + neighborS[i] + id).style("stroke", newStrokeIn);
        g1.selectAll("#circle" + neighborS[i])
          .style("stroke-opacity", newOpacity)
          .style("stroke", newStrokeIn);
      }
      for (let i = 0; i < neighborT.length; i++) {
        g1.selectAll("#line" + id + neighborT[i]).style("stroke", newStrokeOut);
        g1.selectAll("#circle" + neighborT[i])
          .style("stroke-opacity", newOpacity)
          .style("stroke", newStrokeOut);
      }
      //update whether or not the node is active
      d.active = active;
    })
    .on("mouseover", function (e, d) {
      g1.selectAll("circle").style("opacity", 0.2);
      g1.selectAll("line").style("opacity", 0.2);
      const id = d.id,
        neighborS = neighborSource[id],
        neighborT = neighborTarget[id];

      //highlight the current node and its neighbors
      g1.selectAll("#circle" + id).style("opacity", 1);

      for (let i = 0; i < neighborS.length; i++) {
        g1.selectAll("#line" + neighborS[i] + id).style("opacity", 1);
        g1.selectAll("#circle" + neighborS[i]).style("opacity", 1);
      }
      for (let i = 0; i < neighborT.length; i++) {
        g1.selectAll("#circle" + neighborT[i]).style("opacity", 1);
        g1.selectAll("#line" + id + neighborT[i]).style("opacity", 1);
      }
    })
    .on("mouseout", function (e, d) {
      g1.selectAll("circle").style("opacity", 1);
      g1.selectAll("line").style("opacity", lineOpacity);
    });

  //Listen for tick events to render the nodes as they update in your Canvas or SVG.
  simulation.nodes(dataSet.nodes).on("tick", ticked);

  simulation.force("link").links(dataSet.links);

  // This function is run at each iteration of the force algorithm, updating the nodes position (the nodes data array is directly manipulated).
  function ticked() {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node
      .attr("cx", function (d) {
        return (d.x = Math.max(nodeRadius, Math.min(width - nodeRadius, d.x))); // 限制节点的绘制范围
      })
      .attr("cy", function (d) {
        return (d.y = Math.max(nodeRadius, Math.min(height - nodeRadius, d.y)));
      })
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    edgepaths.attr(
      "d",
      (d) => "M " + d.source.x + " " + d.source.y + " L " + d.target.x + " " + d.target.y,
    );
    // 文本方向倒置修正
    edgelabels.attr("transform", function (d) {
      if (d.target.x < d.source.x) {
        const bbox = this.getBBox();
        const rx = bbox.x + bbox.width / 2;
        const ry = bbox.y + bbox.height / 2;
        // rx ry 旋转中心。css 不支持三个参数？
        return "rotate(180 " + rx + " " + ry + ")"; // translate(" + 0 + "," + 15 + ")";
      } else {
        return "rotate(0)";
      }
    });
  }
  // html 部分无法下载
  // name a letiable tooltip, and style it using css properties
  const tooltip = d3
    .select("#force-graph")
    .append("div") // the tooltip always "exists" as its own html div, even when not visible
    .style("position", "absolute") // the absolute position is necessary so that we can manually define its position later
    .style("visibility", "hidden") // hide it from default at the start so it only appears on hover
    .style("background-color", "white")
    .attr("class", "tooltip");

  function tooltipIn(event, d) {
    //name a tooltip_in function to call when the mouse hovers a node
    return tooltip
      .html("<h4>" + d.id + ":" + d.name + "</h4>") // add an html element with a header tag containing the name of the node.  This line is where you would add additional information like: "<h4>" + d.name + "</h4></br><p>" + d.type + "</p>"  Note the quote marks, pluses and </br>--these are necessary for javascript to put all the data and strings within quotes together properly.  Any text needs to be all one line in .html() here
      .style("visibility", "visible") // make the tooltip visible on hover
      .style("top", event.pageY + "px") // position the tooltip with its top at the same pixel location as the mouse on the screen
      .style("left", event.pageX + "px"); // position the tooltip just to the right of the mouse location
  }
  function tooltipOut(event, d) {
    return (
      tooltip
        // .transition()
        // .duration(500) // give the hide behavior a 50 milisecond delay so that it doesn't jump around as the network moves
        .style("visibility", "hidden")
    ); // hide the tooltip when the mouse stops hovering
  }
  function nodeDBlclick(event, d) {
    delete d.fx;
    delete d.fy;
    d3.select(this).classed("fixed", false);
    // simulation.alpha(1).restart();
  }
  //When the drag gesture starts, the targeted node is fixed to the pointer
  //The simulation is temporarily “heated” during interaction by setting the target alpha to a non-zero value.
  function dragStarted(event, d) {
    d3.select(this).classed("fixed", true);
    // debugger
    if (!event.active) simulation.alphaTarget(0.3).restart(); // 设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0, 1] sets the current target alpha to the specified number in the range [0,1].
    d.fy = d.y; //fx - the node’s fixed x-position. Original is null.
    d.fx = d.x; //fy - the node’s fixed y-position. Original is null.
  }

  //When the drag gesture starts, the targeted node is fixed to the pointer
  function dragged(event, d) {
    d.fx = Math.max(nodeRadius, Math.min(width - nodeRadius, event.x)); // 限制节点的拖拽范围
    d.fy = Math.max(nodeRadius, Math.min(height - nodeRadius, event.y));
    tooltipOut(event, d);
  }
  // Sticky Force Layout 拖拽固定，点击取消
  // https://observablehq.com/@d3/sticky-force-layout
  //When the drag gesture ends, the targeted node is released and the simulation is re-heated.
  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    // d.fx = null;
    // d.fy = null;
    d.fx = clamp(event.x, 0, width); // set d.fx = x and d.fy = y while dragging
    d.fy = clamp(event.y, 0, height);
  }

  function clamp(x, lo, hi) {
    return x < lo ? lo : x > hi ? hi : x;
  }
  // 构建颜色比例尺
  function buildColorScale(data) {
    const temp = {};
    const colors = ["#ff9e6d", "#86cbff", "#c2e5a0", "#fff686", "#9e79db"];
    data.nodes.forEach(function (item) {
      temp[item.group] = colors[item.group];
    });
    const domain = Object.keys(temp);
    const range = domain.map(function (item, i) {
      return colors[i] || "#" + ((Math.random() * 0xffffff) << 0).toString(16); // 随机颜色
    });
    return d3
      .scaleOrdinal() //=d3.scaleOrdinal(d3.schemeSet2)
      .domain(domain) // 分类域 || ['A', 'B', 'C', 'D', 'E']
      .range(range); // 颜色
  }

  //绘制 legend
  const legend_g = g2
    .selectAll(".legend")
    .data(colorScale.domain())
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(${width - 80},${i * 20 + 20})`);

  legend_g.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 5).attr("fill", colorScale);

  legend_g
    .append("text")
    .attr("x", 10)
    .attr("y", 5)
    .style("font-size", "10px")
    .text((d) => d);

  //drawing the second legend
  const legend_g2 = g2.append("g").attr("transform", `translate(${width - 80}, 140)`);

  legend_g2
    .append("circle")
    .attr("r", 5)
    .attr("cx", 0)
    .attr("cy", 0)
    .style("stroke", "grey")
    .style("stroke-opacity", 0.3)
    .style("stroke-width", 15)
    .style("fill", "black");
  legend_g2.append("text").attr("x", 15).attr("y", 0).text("long runtime").style("font-size", "10px");

  legend_g2
    .append("circle")
    .attr("r", 5)
    .attr("cx", 0)
    .attr("cy", 20)
    .style("stroke", "grey")
    .style("stroke-opacity", 0.3)
    .style("stroke-width", 2)
    .style("fill", "black");
  legend_g2.append("text").attr("x", 15).attr("y", 20).text("short runtime").style("font-size", "10px");
}

render(dataSet);
// TODO:搜索节点高亮，聚焦
// 重绘
// setTimeout(() => {
//   d3.select("#force-graph").selectAll("*").remove(); //清空SVG中的内容
//   render(dataset2);
// }, 3000);

// document.querySelector("#download-btn").addEventListener("click", download);
// // 下载 svg 不支持外部 css
// function download() {
//   //add xml declaration and serialize
//   let svgData =
//     '<?xml version="1.0" standalone="no"?>\r\n' +
//     new XMLSerializer().serializeToString(document.querySelector("svg"));
//   //convert svg source to URI data scheme.
//   // let url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
//   let downloadLink = document.createElement("a");
//   downloadLink.href = URL.createObjectURL(new Blob([svgData], { type: "image/svg+xml;charset=utf-8" }));
//   downloadLink.download = new Date().toLocaleDateString() + ".svg";
//   document.body.appendChild(downloadLink);
//   downloadLink.click();
//   document.body.removeChild(downloadLink);
// }

// 下载，支持外部 css
d3.select("#download-btn").on("click", function () {
  const svgString = getSVGString(d3.select("svg").node());
  svgString2Image(svgString, 2 * width, 2 * height, "png", save); // passes Blob and filesize String to the callback

  function save(dataBlob, filesize) {
    // eslint-disable-next-line no-undef
    saveAs(dataBlob, "fileName.png"); // FileSaver.js function
  }
});

// Below are the functions that handle actual exporting:
// getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
function getSVGString(svgNode) {
  svgNode.setAttribute("xlink", "http://www.w3.org/1999/xlink");
  const cssStyleText = getCSSStyles(svgNode);
  appendCSS(cssStyleText, svgNode);

  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(svgNode);
  svgString = svgString.replace(/(\w+)?:?xlink=/g, "xmlns:xlink="); // Fix root xlink without namespace
  svgString = svgString.replace(/NS\d+:href/g, "xlink:href"); // Safari NS namespace fix

  return svgString;

  function getCSSStyles(parentElement) {
    let nodesToCheck = [parentElement],
      i;

    // Add all the different nodes to check
    const childNodes = parentElement.getElementsByTagName("*");
    for (i = 0; i < childNodes.length; i++) {
      nodesToCheck.push(childNodes[i]);
    }

    // Extract CSS Rules
    const extractedCSSRules = [];
    for (i = 0; i < document.styleSheets.length; i++) {
      const s = document.styleSheets[i];

      try {
        if (!s.cssRules) continue;
      } catch (e) {
        if (e.name !== "SecurityError") throw e; // for Firefox
        continue;
      }

      const cssRules = s.cssRules;
      let ruleMatches;
      for (let r = 0; r < cssRules.length; r++) {
        ruleMatches = nodesToCheck.reduce(function (a, b) {
          return a || b.matches(cssRules[r].selectorText);
        }, false);
        if (ruleMatches) extractedCSSRules.push(cssRules[r].cssText);
      }
    }
    return extractedCSSRules.join(" ");
  }
  function appendCSS(cssText, element) {
    const styleElement = document.createElement("style");
    styleElement.setAttribute("type", "text/css");
    styleElement.innerHTML = cssText;
    const refNode = element.hasChildNodes() ? element.children[0] : null;
    element.insertBefore(styleElement, refNode);
  }
}

function svgString2Image(svgString, width, height, format, callback) {
  format = format ? format : "png";
  const imgsrc = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  const image = new Image();
  image.onload = function () {
    context?.clearRect(0, 0, width, height);
    context?.drawImage(image, 0, 0, width, height);

    canvas.toBlob(function (blob) {
      const filesize = Math.round(blob.length / 1024) + " KB";
      if (callback) callback(blob, filesize);
    });
  };

  image.src = imgsrc;
}
