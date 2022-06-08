const crimeData = d3.csv('crime.csv').then((data) => {
    let margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 60
    }, width = 1000 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;

    let svg = d3.select("svg")
        .attr("width", 1000)
        .attr("height", 1000)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")") //Shift horizontal by 40px and vertical by 20px

    let crimeSorted = []
    var dataObj = {};
    var index = 0;
    for(var i = 0; i < data.length; i++) {
        dataObj[data[i].level_2] = data[i].value
        dataObj['year'] = data[i].year

        if ( index == 9) {
            crimeSorted.push(dataObj);
            dataObj = {};
            index = 0;
        } else {
            index++;
        }
    }
    console.log(crimeSorted)
    const crimeGroups = [
        "Murder",
        "Serious Hurt",
        "Rape",
        "Outrage Of Modesty",
        "Rioting",
        "Robbery",
        "Housebreaking",
        "Theft Of Motor Vehicle",
        "Snatch Theft",
        "Cheating Related Offences"]

    //Generate the subgroup so that can pass this to the d3 stack generator
    const stackGen = d3.stack() //returns a stack generator
        .keys(crimeGroups)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    const series = stackGen(crimeSorted)
    console.log(series)

    const years = crimeSorted.map((dArr) => {
        return dArr.year
    })

    //X axis generate using D3 Scale
    let xScale = d3.scaleBand()
        .domain(years)
        .range([0, width])
        .padding([0.3])

    //Y axis generate using D3 Scale
    let yScale = d3.scaleLinear()
    .domain([0, 19000])
    .range([height, 0]);

    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + 0+ ")")
        .call(d3.axisLeft(yScale));

    svg.append("text")
    .attr("transform", "translate(" + (width / 2) + "," + (height + 40) + ")")
    .text("Years (2011 - 2020) ")
    .attr("text-align", "middle");
    
    svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + height + ")")
    .call(d3.axisBottom(xScale).tickSizeOuter(0));

    svg.append("g")
    .append("text")
    .attr("transform", "translate(10, " + (height / 2) + ") rotate(-90)")
    .text("Total Number of Crime")
    .attr("text-align", "middle")


    //Colour scale generate using D3 Scale
    const colorScale = d3.scaleOrdinal()
        .domain(crimeGroups)
        .range(["#ade6f4",
            "#488f31",
            "#83af70",
            "#bad0af",
            "#f1f1f1",
            "#f0b8b8",
            "#e67f83",
            "#e88b8d",
            "#df676e",
            "#de425b"]);

    svg.append("g")
        .selectAll("g")
        .data(series)
        .enter().append("g")
            .attr("fill", d => colorScale(d.key))
            .selectAll("rect")
            .data(d => {return d})
            .enter().append("rect")
                .attr("x", d => xScale(d.data.year))
                .attr("y", d => yScale(d[1]))
                .attr("height", d => yScale(d[0]) - yScale(d[1]))
                .attr("width", xScale.bandwidth())
                .attr("transform", "translate(60" + ")")


    const legends = svg.append("g")
        .attr("height", 100)
        .attr("width", 100)
        .attr("transform", "translate(300, 10)")

    legends.selectAll("rect")
        .data(crimeGroups)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 18)
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", d => colorScale(d))

    legends.selectAll("text")
        .data(crimeGroups)
        .enter()
        .append("text")
        .text(d => d)
        .attr("x", 18)
        .attr("y", (d, i) => i * 18)
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'hanging');
})





