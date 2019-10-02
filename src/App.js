import React from "react";
import "./App.css";
import addBars from "./components/bars/addBars";

import { getRandomInt, timeout } from "./components/helperfunctions/helper";

import SortingPlate from "./components/sortingPlate";
import Heading from "./components/heading";

class App extends React.Component {
  state = {
    barsList: [],
    numberOfBars: 13,
    delay: 400,
    currentChosenSortingAlgo: "BubbleSort",
    deactivate: false
  };

  componentWillMount() {
    this.addelementsTolist();
    addBars(this.state.barsList);
  }

  handleChange = (event, newValue) => {
    if (!this.state.deactivate) {
      this.setState({ numberOfBars: newValue });
      this.addelementsTolist();
    }
  };

  addelementsTolist = () => {
    var i = 0;
    var height = 0;
    var tempBarList = [];
    while (i < this.state.numberOfBars) {
      height = getRandomInt(10, 230);
      tempBarList.push({
        barHeight: height,
        barColor: "beige"
      });
      i = i + 1;
    }
    this.setState({
      barsList: tempBarList
    });
  };

  changeColor = (array, index, color) => {
    array[index]["barColor"] = color;
    this.setState({
      barsList: array
    });
    return array;
  };

  //Bubble Sort
  bubbleSort = async () => {
    this.setState({
      deactivate: true
    });
    var items = this.state.barsList;
    var length = items.length;
    for (var i = 0; i < length; i++) {
      for (var j = 0; j < length - i - 1; j++) {
        if (items[j]["barHeight"] > items[j + 1]["barHeight"]) {
          items = this.changeColor(items, j, "#91d3e3");
          items = this.changeColor(items, j + 1, "#91d3e3");

          var tmp = items[j]["barHeight"];
          items[j]["barHeight"] = items[j + 1]["barHeight"];
          items[j + 1]["barHeight"] = tmp;
        }
        await timeout(this.state.delay);
        items = this.changeColor(items, j, "beige");
        items = this.changeColor(items, j + 1, "#91e395");

        this.setState({
          barsList: items
        });
      }
    }
    var items = this.state.barsList;
    for (var i = 0; i < length; i++) {
      items[i]["barColor"] = "beige";
    }
    this.setState({
      barsList: items
    });
    this.setState({
      deactivate: false
    });
  };
  quickChangeColor = (index, color) => {
    var array = this.state.barsList;
    array[index]["barColor"] = color;
    this.setState({
      barsList: array
    });
  };
  swap = (leftIndex, rightIndex) => {
    var items = this.state.barsList;
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
    this.setState({
      barsList: items
    });
  };
  partition = async (left, right) => {
    var pivot = this.state.barsList[Math.floor((right + left) / 2)];

    this.quickChangeColor(this.state.barsList.indexOf(pivot), "#5c5c5c");
    var i = left;
    var j = right;
    while (i <= j) {
      while (this.state.barsList[i]["barHeight"] < pivot["barHeight"]) {
        i++;
        this.quickChangeColor(i, "#91d3e3");
        await timeout(this.state.delay);
        this.quickChangeColor(i, "beige");
      }
      while (this.state.barsList[j]["barHeight"] > pivot["barHeight"]) {
        j--;
        this.quickChangeColor(j, "#91d3e3");
        await timeout(this.state.delay);
        this.quickChangeColor(j, "beige");
      }
      if (i <= j) {
        this.swap(i, j);
        i++;
        j--;
      }
    }

    return i;
  };

  quickSort = async (left, right) => {
    var index;
    if (this.state.barsList.length > 1) {
      index = await this.partition(left, right);
      this.quickChangeColor(index, "#91e395");
      await timeout(this.state.delay);
      this.quickChangeColor(index, "beige");
      if (left < index - 1) {
        this.quickSort(left, index - 1);
      }
      if (index < right) {
        this.quickSort(index, right);
      }
    }
  };

  renderQuickSort = () => {
    this.quickSort(0, this.state.barsList.length - 1);
  };

  onChangeAlgo = algo => {
    this.setState({
      currentChosenSortingAlgo: algo
    });
  };

  onChangeSpeed = speed => {
    this.setState({
      delay: speed
    });
  };

  sorting = () => {
    if (!this.state.deactivate) {
      if (this.state.currentChosenSortingAlgo === "BubbleSort") {
        return this.bubbleSort;
      } else if (this.state.currentChosenSortingAlgo === "QuickSort") {
        return this.renderQuickSort;
      }
    } else {
      return null;
    }
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="heading">
            <Heading />
          </div>
        </div>
        <div className="row justify-content-center">
          <SortingPlate
            numberOfBars={this.state.numberOfBars}
            addBars={addBars(this.state.barsList)}
            barsList={this.state.barsList}
            slider={this.handleChange}
            Sort={this.sorting()}
            onChangeAlgo={this.onChangeAlgo}
            onChangeSpeed={this.onChangeSpeed}
          />
        </div>
      </div>
    );
  }
}
export default App;
