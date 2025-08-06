package org.exemple.pfe_s.Controller;

import org.exemple.pfe_s.Entity.Avis;
import org.exemple.pfe_s.Repository.AviRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/avis")
@CrossOrigin(origins = "http://localhost:5173") // adapte si besoin
public class AvisController {

    @Autowired
    private AviRepository aviRepository;

    // Récupérer tous les avis
    @GetMapping("")
    public List<Avis> getAllAvis() {
        return aviRepository.findAllByOrderByIdDesc();
    }

    // Ajouter un nouvel avis
    @PostMapping("/add")
    public ResponseEntity<Avis> addAvis(@RequestBody Avis avis) {
        Avis savedAvis = aviRepository.save(avis);
        return ResponseEntity.ok(savedAvis);
    }
    // Supprimer un avis par ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteAvis(@PathVariable Long id) {
        aviRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
