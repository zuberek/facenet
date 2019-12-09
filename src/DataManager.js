export default class DataManager {
    static generateNodes(source_path, ego, start, end) {
        let source = require('./inputs/Chirs-friends.json');
        let people = source.nodes;
        let nodes = [ego]
        let links = []

        let max_count = Number.MIN_SAFE_INTEGER
        let min_count = Number.MAX_SAFE_INTEGER

        const COUNT_CLIP = 1000
        const DECREASER = 0.01

        let displayed_nodes = []
        for (let index in people) {
            let person = people[index]
            let years = person.years

            // count messages based on date range
            let message_count = 0
            Object.keys(years).forEach(function(year) {
                let current_year = parseInt(year)
                if (current_year >= start  && current_year <= end) {
                    message_count += years[year]
                    if (message_count > COUNT_CLIP) {
                        message_count = COUNT_CLIP + DECREASER*(message_count-COUNT_CLIP);
                    }
                }
            });

            if (message_count > max_count) max_count = message_count
            if (message_count < min_count) min_count = message_count

            if (message_count > 0) {
                displayed_nodes.push(person.id);
                nodes.push({
                    "id": person.id,
                    "name": person.name,
                    "relationship": person.relationship
                });

                links.push({
                    "source": ego.id,
                    "target": person.id,
                    "distance": message_count,
                    "message_count": message_count
                });
            }   
        }
        let max_distance = 300;
        // normalise the data
        for (let i = 0; i < links.length; i++) {
            let cur = links[i];
            cur.distance = max_distance - (((cur.distance - min_count) / (max_count - min_count)) * max_distance);
        }
        // let EGO_ALTER_CONST = 1;
        // // normalise the data
        // for (let i = 0; i < links.length; i++) {
        //     let cur = links[i];
        //     let normalized = ((cur.distance - min_count) / (max_count - min_count))
        //     let inversed = Math.pow(normalized, -1)

        //     cur.distance = inversed * EGO_ALTER_CONST / 100;
        // }
        console.log(links[0].distance);


        // deals with alter to alter
        let alter_distance = 10;
        // append links given to links
        let source_links = JSON.parse(JSON.stringify(source.links));

        // normalise the alter links
        let filtered_source_links = []
        for (let i = 0; i < source_links.length; i++) {
            let cur = source_links[i];
            if (displayed_nodes.indexOf(cur.target) >= 0 && displayed_nodes.indexOf(cur.source) >= 0) {
                filtered_source_links.push(cur);
                cur.distance = cur.distance * alter_distance;
            }
        }
        links = links.concat(filtered_source_links);
        

        
        return JSON.stringify({"nodes": nodes, "links": links});
    }

    static getMaxMinDates() {

    }
}
