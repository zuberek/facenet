export default class DataManager {
    static generateNodes(source_path, ego, start, end, threshold) {
        let source = require('./inputs/Chirs-friends_v2.json');
        let people = source.nodes;
        let nodes = [ego]
        let links = []

        let max_count = Number.MIN_SAFE_INTEGER
        let min_count = Number.MAX_SAFE_INTEGER

        let max_year = Number.MIN_SAFE_INTEGER;
        let min_year = Number.MAX_SAFE_INTEGER;

        const COUNT_CLIP = 1000
        const DECREASER = 0.01

        let displayed_nodes = []
        for (let index in people) {
            let person = people[index]
            let years = person.years

            // count messages based on date range
            let message_distance = 0;
            let message_count = 0;
            Object.keys(years).forEach(function(year) {
                let current_year = parseInt(year)
                if (current_year >= start  && current_year <= end) {
                    message_count += years[year];
                    message_distance += years[year];
                    if (message_distance > COUNT_CLIP) {
                        message_distance = COUNT_CLIP + DECREASER * (message_distance-COUNT_CLIP);
                    }
                }

                if (current_year > max_year) max_year = current_year;
                if (current_year < min_year) min_year = current_year;
            });

            if (message_distance > max_count) max_count = message_distance
            if (message_distance < min_count) min_count = message_distance

            if (message_distance > 0) {
                displayed_nodes.push(person.id);
                nodes.push({
                    "id": person.id,
                    "name": person.name,
                    "relationship": person.relationship,
                    "cluster": person.cluster
                });

                links.push({
                    "source": ego.id,
                    "target": person.id,
                    "distance": message_distance,
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

        // deals with alter to alter
        let alter_distance = 10;
        // append links given to links
        let source_links = JSON.parse(JSON.stringify(source.links));

        // normalise the alter links
        let filtered_source_links = []
        for (let i = 0; i < source_links.length; i++) {
            let cur = source_links[i];
            if (cur.distance >= threshold && displayed_nodes.indexOf(cur.target) >= 0 && displayed_nodes.indexOf(cur.source) >= 0) {
                filtered_source_links.push(cur);
                cur.distance = alter_distance - (cur.distance * alter_distance);
            }
        }
        links = links.concat(filtered_source_links);
        

        
        return JSON.parse(JSON.stringify({
            "nodes": nodes, 
            "links": links, 
            "max_year": max_year, 
            "min_year": min_year
        }));
    }

    static getMaxMinDates() {
    }
}
