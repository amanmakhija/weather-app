import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import axios from "axios";

const Search = ({ onSearchChange }) => {

    const [search, setSearch] = useState(null);

    const loadOptions = async (inputValue) => {
        try {
            var res = await axios.get(process.env.REACT_APP_GEO_API_URL + "/cities?minPopulation=1000000&namePrefix=" + inputValue, {
                headers: {
                    "x-rapidapi-key": process.env.REACT_APP_RAPID_API_KEY,
                    "x-rapidapi-host": process.env.REACT_APP_RAPID_API_HOST
                }
            });
            res = res.data;
            return {
                options: res.data.map((city) => {
                    return {
                        value: `${city.latitude} ${city.longitude}`,
                        label: `${city.name} ${city.countryCode}`,
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleOnChange = (searchData) => {
        setSearch(searchData);
        onSearchChange(searchData);
    }

    return (
        <AsyncPaginate
            placeholder="Search For City"
            debounceTimeout={600}
            value={search}
            onChange={handleOnChange}
            loadOptions={loadOptions}
        />
    );
}

export default Search;