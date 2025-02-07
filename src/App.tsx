import { useState, useEffect } from 'react';
import { Container, TextField, Grid, Card, CardMedia, CardContent, Typography, Pagination, Divider } from '@mui/material';
import axios from 'axios';
import './App.css';

interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  cuisine: string;
  instructions: string;
}

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    fetchRecipes();
  }, [page]);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`https://dummyjson.com/recipes?limit=10&skip=${(page - 1) * 10}`);
      setRecipes(response.data.recipes);
      setTotalPages(Math.ceil(response.data.total / 10));
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    try {
      const response = await axios.get(`https://dummyjson.com/recipes/search?q=${event.target.value}`);
      setRecipes(response.data.recipes);
      setTotalPages(Math.ceil(response.data.total / 10));
    } catch (error) {
      console.error('Error searching recipes:', error);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Container>
    <TextField
      label="Search Recipes"
      variant="outlined"
      fullWidth
      margin="normal"
      value={searchTerm}
      onChange={handleSearch}
    />
    <Grid container spacing={2}>
      {recipes.map((recipe) => (
        <Grid item sm={12} md={6} key={recipe.id}>
          <Card>
            <CardMedia
              component="img"
              height="240"
              image={`https://cdn.dummyjson.com/recipe-images/${recipe.id}.webp`}
              alt={recipe.name}
            />
            <CardContent>
              <Typography variant="h5" component="div">
                {recipe.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cuisine: {recipe.cuisine}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ingredients: {recipe.ingredients.join(', ')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Instructions: {recipe.instructions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
    <Pagination count={totalPages} page={page} onChange={handlePageChange} />
  </Container>
  );
}

export default App;