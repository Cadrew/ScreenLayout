import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import generate from "@babel/generator";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

let components = [
  { id: 0, pos: '0;0;8;18' }, //x;y;w;h
  { id: 1, pos: '8;0;4;2' },
  { id: 2, pos: '8;2;4;8' },
  { id: 3, pos: '8;10;4;8' },
  { id: 4, pos: '0;18;4;5' },
  { id: 5, pos: '4;18;4;5' },
  { id: 6, pos: '8;18;4;5' },
];

if(typeof(window.location.href.split("?")[1]) !== "undefined") {
  let mode = window.location.href.split("?")[1].split("mode=")[1];
  //fullscreen mode
  if(typeof(mode) !== "undefined" && mode.includes("fullscreen")) {
    components = [
      { id: 0, pos: '0;0;8;22' }, //x;y;w;h
      { id: 1, pos: '8;0;4;2' },
      { id: 2, pos: '8;2;4;10' },
      { id: 3, pos: '8;12;4;10' },
      { id: 4, pos: '0;22;4;5' },
      { id: 5, pos: '4;22;4;5' },
      { id: 6, pos: '8;22;4;5' },
    ];
  }
}


export default class ShowcaseLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBreakpoint: "lg",
      compactType: "vertical",
      mounted: false,
      layouts: { lg: props.initialLayout }
    };

    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onCompactTypeChange = this.onCompactTypeChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onNewLayout = this.onNewLayout.bind(this);
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }
/*
  generateDOM() {
    return _.map(this.state.layouts.lg, function(l, i) {
      return (
        <div key={i} className={l.static ? "static" : ""}>
          {l.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {i}
            </span>
          ) : (
            <span className="text">{i}</span>
          )}
        </div>
      );
    });
  }*/

    generateDOM() {
    generateLayout(components);
    return _.map(this.state.layouts.lg, function(l, i) {
      return (
        <div key={i} className={l.static ? "static" : ""}>
          {l.static && i === 0 &&
            <span id="room-layout">
              <span id="room-title">Salles disponibles<span className="little">&nbsp; - Work in progress</span></span>
              <img src="./images/marker2.png" id="marker-green" />
              <img src="./images/marker3.png" id="marker-red" />
              <img id="room-map" src="images/etage1.png" />
            
            </span>
          }
          {l.static && i === 1 &&
            <span>
              <a className="weatherwidget-io" href="https://forecast7.com/fr/43d535d45/aix-en-provence/" data-label_1="AIX-EN-PROVENCE" data-label_2="MÉTÉO" data-theme="original">AIX-EN-PROVENCE MÉTÉO</a>
            </span>
          }
          {l.static && i === 2 &&
            <iframe src="chrono.html" title="bus" width="100%" height="100%"></iframe>
          }
          {l.static && i === 3 &&
            <iframe src="landscape-preset.html" title="bus" width="100%" height="100%"></iframe>
          }
          {l.static && i === 4 &&
            <a className="twitter-timeline" href="https://twitter.com/AtosFR" data-chrome="noheader" data-tweet-limit="1" data-width="399" ></a>
          }
          {l.static && i === 5 &&
            <span id="mood">
            <span id="mood-title">L'humeur du jour</span>
              <div id="mood-package"></div>
              <div id="mood-package-result"></div>
              <table id="div-mood" >
                  <tr>
                    <td><img id="mood-img" src="./images/smiley3.png" width="100px;" /></td>
                    <td><span id="mood-result"><span id="mood-value">0</span> <span id="mood-txt">votant</span></span></td>
                  </tr>
              </table>
            </span>
          }
          {l.static && i === 6 &&
            <span id="parking-layout">
              <img src="images/parking.jpg" />
              <span id="parking-title">Parking<span className="little"> - Work in progress</span></span>
              <span id="parking-result"><span>0</span>/46&nbsp;&nbsp;places disponibles</span>
            </span>
          }
          {!l.static &&
            <span className="text">Ce layout (n°{i}) n'est pas censé se trouvé là.</span>          
          }
        
        </div>
      );
    });
  }

  onBreakpointChange(breakpoint) {
    this.setState({
      currentBreakpoint: breakpoint
    });
  }

  onCompactTypeChange() {
    const { compactType: oldCompactType } = this.state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical"
          ? null
          : "horizontal";
    this.setState({ compactType });
  }

  onLayoutChange(layout, layouts) {
    this.props.onLayoutChange(layout, layouts);
  }

  onNewLayout() {
    this.setState({
      layouts: { lg: generateLayout(components) }
    });
  }

  render() {
    return (
      <div>
        {/*<div>
          Current Breakpoint: {this.state.currentBreakpoint} ({
            this.props.cols[this.state.currentBreakpoint]
          }{" "}
          columns)
        </div>
        <div>
          Compaction type:{" "}
          {_.capitalize(this.state.compactType) || "No Compaction"}
        </div>
        <button onClick={this.onNewLayout}>Generate New Layout</button>
        <button onClick={this.onCompactTypeChange}>
          Change Compaction Type
        </button>*/}
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

ShowcaseLayout.propTypes = {
  onLayoutChange: PropTypes.func.isRequired
};

ShowcaseLayout.defaultProps = {
  className: "layout",
  rowHeight: 30,
  onLayoutChange: function() {},
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  initialLayout: generateLayout(components)
};

/*
function generateRandomLayout() {
  return _.map(_.range(0, 7), function(item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: (_.random(0, 5) * 2) % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05
    };
  });
}*/

function generateLayout(comp) {
  console.log("Call GenerateLayout");
  var component = comp;
  return _.map(component, function(item, i) {
    var x = parseInt(item.pos.split(';')[0]);
    var y = parseInt(item.pos.split(';')[1]);
    var w = parseInt(item.pos.split(';')[2]);
    var h = parseInt(item.pos.split(';')[3]);
    return {
      x: x,
      y: y,
      w: w,
      h: h,
      i: i.toString(),
      static: true
    };
  });
}

document.addEventListener("keyup", event => {
  console.log(event.keyCode);
  if(event.isComposing || event.keyCode === 122) {
    console.log("press F11");
    if(typeof(window.location.href.split("?")[1]) !== "undefined") {
      window.location.href = window.location.href.split("?")[0];
    } else {
      window.location.href = window.location.href + "?mode=fullscreen";
    }
  }
});