import { useEffect, useState } from "react";
import {View, Text, TextInput, TouchableOpacity, FlatList} from "react-native";
import {MealAPI} from "../../services/mealAPI";
import {useDebounce} from "../../hooks/useDebounce";
import {searchStyles} from "../../assets/styles/search.styles";
import { COLORS } from "../../constans/colors";
import {Ionicons} from "@expo/vector-icons";
import RecipeCard from "../../components/RecipeCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const SearchScreen = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const debounceSearchQuery = useDebounce(searchQuery, 300);

    const perfomSearch = async (query) => {

        if(!query.trim()) {

            const randomMeals = await MealAPI.getRandomMeals(12)
            return randomMeals.map(meal => MealAPI.transformMealData(meal))
            .filter(meal => meal !== null)
        }

        const nameResults = await MealAPI.searchMealsByName(query);
        let results = nameResults;

        if(results.length === 0) {

            const ingredientResults = await MealAPI.filterByIngredient(query);
            results = ingredientResults;
        }

        return results.slice(0,12).map(meal => MealAPI.transformMealData(meal))
        .filter((meal) => meal !== null);
    };

    useEffect(() => {

        const loadInitialData = async () => {

            try {

                const results = perfomSearch("");
                setRecipes(results);
                
            } catch (error) {

                console.error("Error loading initial data:", error);
                
            } finally {

                setInitialLoading(false);

            }
        };

        loadInitialData()

    }, []);

    useEffect(() => {

        if(initialLoading) return;

        const handleSearch = async () => {
            
            setLoading(true);

            try {

                const results = await perfomSearch(debounceSearchQuery);
                setRecipes(results);
                
            } catch (error) {

                console.error("Error searching:", error);
                setRecipes([]);
                
            } finally {

                setLoading(false);

            }
        };

        handleSearch();

    }, [debounceSearchQuery, initialLoading]);

    if(initialLoading) return <LoadingSpinner message="Загрузка..."/>

    return (
        <View style={searchStyles.container}>
            <View style={searchStyles.searchSection}>
                <View style={searchStyles.searchContainer}>
                    <Ionicons name="search" size={20} color={COLORS.textLight} style={searchStyles.searchIcon}/>

                    <TextInput style={searchStyles.searchInput} placeholder="Введите рецепт, ингредиенты..."
                    placeholderTextColor={COLORS.textLight} value={searchQuery} 
                    onChangeText={setSearchQuery} returnKeyType="search"/>

                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")} style={searchStyles.clearButton}>
                            <Ionicons name="close-circle" size={20} color={COLORS.textLight}/>
                        </TouchableOpacity>
                    )}

                </View>
            </View>

            <View style={searchStyles.resultsSection}>
                <View style={searchStyles.resultsHeader}>
                    <Text style={searchStyles.resultsTitle}>
                        {searchQuery ? `Результаты для "${searchQuery}"` : "Популярные рецепты"}
                    </Text>
                    <Text style={searchStyles.resultsCount}>
                        {recipes.length} найдено
                    </Text>
                </View>
                
                {loading ? (
                    
                    <View style={searchStyles.loadingContainer}>

                        <LoadingSpinner message="Загрузка..." size="small"/>
                        
                    </View>
                    
                
                ) : (
                
                <FlatList data={recipes} renderItem={({item}) => <RecipeCard recipe={item}/>}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2} columnWrapperStyle={searchStyles.row}
                contentContainerStyle={searchStyles.recipesGrid}
                showsVerticalScrollIndicator={false} ListEmptyComponent={<NoResultsFound/>}/>
                
                )}

            </View>
        </View>
    );
};

export default SearchScreen;

function NoResultsFound() {

    return (

        <View style={searchStyles.emptyState}>
            <Ionicons name="search-outline" size={64} color={COLORS.textLight}/>
            <Text style={searchStyles.emptyTitle}>Рецепты не найдены</Text>
            <Text style={searchStyles.emptyDescription}>Попробуйте поискать другое</Text>
        </View>
    );
}