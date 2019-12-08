export default class DataManager {
    static generateNodes(source_path, ego, start, end) {
        let source = require('./inputs/Chirs-friends.json');
        let people = source.nodes;
        let nodes = [ego]
        let links = []

        let max_count = Number.MIN_SAFE_INTEGER
        let min_count = Number.MAX_SAFE_INTEGER

        for (let index in people) {
            let person = people[index]
            let years = person.years

            nodes.push({
                "id": person.id,
                "name": person.name,
                "relationship": person.relationship
            });

            // count messages based on date range
            let message_count = 0
            Object.keys(years).forEach(function(year) {
                let current_year = parseInt(year)
                if (current_year >= start  && current_year <= end) {
                    message_count += years[year]
                }
            });

            if (message_count > max_count) max_count = message_count
            if (message_count < min_count) min_count = message_count

            links.push({
                "source": ego.id,
                "target": person.id,
                "distance": message_count,
                "message_count": message_count
            });
        }
        let max_distance = 300;
        let alter_distance = 10;
        // append links given to links
        let source_links = source.links;

        // normalise the alter links
        for (let i = 0; i < source_links.length; i++) {
            let cur = source_links[i];
            cur.distance = cur.distance * alter_distance;
        }

        // normalise the data
        for (let i = 0; i < links.length; i++) {
            let cur = links[i];
            cur.distance = max_distance - (((cur.distance - min_count) / (max_count - min_count)) * max_distance);
        }

        // links = links.concat(source_links);

        // console.log(links);
        return {"nodes": nodes, "links": links}
    }

    static getMaxMinDates() {

    }
}